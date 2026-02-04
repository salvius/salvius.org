require 'exifr/jpeg'

module Jekyll
  class ImageGalleryGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # Define image directory relative to source
      image_dir = File.join(site.source, 'images')

      # Skip if images directory doesn't exist
      return unless File.directory?(image_dir)

      # Get gallery configuration
      gallery_config = site.config['gallery'] || {}
      include_dirs = gallery_config['include_dirs'] || []
      exclude_dirs = gallery_config['exclude_dirs'] || []

      # Validate configuration
      validate_gallery_config(site, image_dir, include_dirs, exclude_dirs)

      # Create arrays to store image data
      images = []

      # Get directories to scan based on configuration
      directories_to_scan = get_directories_to_scan(image_dir, include_dirs, exclude_dirs)

      Jekyll.logger.info "Gallery:", "Scanning #{directories_to_scan.length} directories for images"

      # Scan for images in configured directories
      directories_to_scan.each do |category_dir|
        relative_category = category_dir.sub(image_dir + '/', '')
        category_name = relative_category.split('/').first

        # Find all JPEG images in this directory
        Dir.glob(File.join(category_dir, '*.{jpg,jpeg,JPG,JPEG}')).each do |image_path|
          relative_path = image_path.sub(site.source, '')

          # Extract EXIF data
          exif_data = extract_exif(image_path)

          # Use EXIF date or fall back to file modification time
          date_taken = exif_data[:date_taken]
          if date_taken.nil?
            date_taken = File.mtime(image_path)
            Jekyll.logger.warn "Gallery:", "No EXIF date for #{File.basename(image_path)}, using file mtime"
          end

          year = date_taken.year.to_s

          # Check for optional description file
          description_file = image_path.sub(File.extname(image_path), '.txt')
          description = nil
          if File.exist?(description_file)
            description = File.read(description_file).strip
          end

          image_data = {
            'path' => relative_path,
            'url' => relative_path,
            'filename' => File.basename(image_path, File.extname(image_path)),
            'extension' => File.extname(image_path),
            'category' => category_name,
            'year' => year,
            'date_taken' => date_taken,
            'exif' => exif_data,
            'description' => description
          }

          images << image_data

          # Create individual page for this image (main gallery version)
          create_photo_page(site, image_data, images, 'main')
        end
      end

      # Sort images by date (newest first)
      images.sort_by! { |img| img['date_taken'] }.reverse!

      # Make available to all pages via site.data
      site.data['gallery_images'] = images

      # Group by year and category for easy filtering
      site.data['images_by_year'] = images.group_by { |img| img['year'] }
      site.data['images_by_category'] = images.group_by { |img| img['category'] }

      # Generate category index pages and category-specific photo pages
      site.data['images_by_category'].each do |category, category_images|
        # Create category index page
        page = GalleryCategoryPage.new(site, site.source, category, category_images)
        site.pages << page
        
        # Create photo pages for this category context
        category_images.each do |image_data|
          create_photo_page(site, image_data, category_images, 'category', category)
        end
      end

      # Generate year index pages and year-specific photo pages
      site.data['images_by_year'].each do |year, year_images|
        # Create year index page
        page = GalleryYearPage.new(site, site.source, year, year_images)
        site.pages << page
        
        # Create photo pages for this year context
        year_images.each do |image_data|
          create_photo_page(site, image_data, year_images, 'year', year)
        end
      end

      Jekyll.logger.info "Gallery:", "Generated #{images.length * 3} photo pages (main + category + year contexts) across #{site.data['images_by_category'].keys.length} categories"
    end

    private

    def validate_gallery_config(site, image_dir, include_dirs, exclude_dirs)
      # Check that include_dirs exist
      if include_dirs.any?
        include_dirs.each do |dir|
          dir_path = File.join(image_dir, dir)
          unless File.directory?(dir_path)
            Jekyll.logger.warn "Gallery:", "Configured include directory '#{dir}' does not exist"
          end
        end
      end

      # Check that exclude_dirs exist
      if exclude_dirs.any?
        exclude_dirs.each do |dir|
          dir_path = File.join(image_dir, dir)
          unless File.directory?(dir_path)
            Jekyll.logger.warn "Gallery:", "Configured exclude directory '#{dir}' does not exist"
          end
        end
      end
    end

    def get_directories_to_scan(image_dir, include_dirs, exclude_dirs)
      directories = []

      if include_dirs.any?
        # If include_dirs is specified, only scan those directories and their subdirectories
        include_dirs.each do |dir|
          dir_path = File.join(image_dir, dir)
          if File.directory?(dir_path)
            # Add the directory itself
            directories << dir_path
            # Add all subdirectories recursively
            directories.concat(get_all_subdirectories(dir_path))
          end
        end
      else
        # If no include_dirs, scan all directories
        directories = get_all_subdirectories(image_dir)
      end

      # Apply exclusions (always filter out 'generated' and any configured exclude_dirs)
      directories.reject do |dir|
        if File.basename(dir) == 'generated'
          true
        elsif exclude_dirs.any?
          relative_path = dir.sub(image_dir + '/', '')
          exclude_dirs.any? do |excluded|
            relative_path == excluded || relative_path.start_with?(excluded + '/')
          end
        else
          false
        end
      end
    end

    def get_all_subdirectories(root_dir)
      directories = []

      Dir.glob(File.join(root_dir, '**', '*/')).each do |dir|
        next if ['.', '..'].include?(File.basename(dir))
        directories << dir
      end

      directories
    end

    def create_photo_page(site, image_data, context_images, context_type, context_value = nil)
      # Create a new page for this photo in the appropriate context
      page = PhotoPage.new(site, site.source, image_data, context_images, context_type, context_value)
      site.pages << page
    end

    def extract_exif(image_path)
      data = {
        date_taken: nil,
        camera: nil,
        lens: nil,
        aperture: nil,
        shutter_speed: nil,
        iso: nil,
        focal_length: nil,
        location: nil,
        width: nil,
        height: nil,
        orientation: nil
      }

      begin
        exif = EXIFR::JPEG.new(image_path)

        if exif
          # Basic info
          data[:date_taken] = exif.date_time
          data[:width] = exif.width
          data[:height] = exif.height
          data[:orientation] = exif.orientation

          # Camera info
          if exif.make || exif.model
            make = exif.make&.strip
            model = exif.model&.strip
            # Remove redundant make from model if present
            if make && model && model.start_with?(make)
              data[:camera] = model
            else
              data[:camera] = [make, model].compact.join(' ')
            end
          end

          # Lens info
          data[:lens] = exif.lens_model&.strip if exif.respond_to?(:lens_model)

          # Settings
          data[:aperture] = exif.f_number.to_f if exif.f_number
          data[:shutter_speed] = format_shutter_speed(exif.exposure_time.to_f) if exif.exposure_time
          data[:iso] = exif.iso_speed_ratings if exif.iso_speed_ratings
          data[:focal_length] = "#{exif.focal_length.to_f}mm" if exif.focal_length

          # GPS data
          if exif.gps && exif.gps.latitude && exif.gps.longitude
            data[:location] = {
              'latitude' => exif.gps.latitude.to_f.round(6),
              'longitude' => exif.gps.longitude.to_f.round(6),
              'altitude' => exif.gps.altitude&.to_f&.round(2)
            }
          end
        end
      rescue => e
        Jekyll.logger.warn "EXIF Error:", "Could not read EXIF from #{File.basename(image_path)}: #{e.message}"
      end

      # Convert symbol keys to string keys for Liquid template compatibility
      data.transform_keys(&:to_s).transform_values do |value|
        if value.is_a?(Hash)
          value.transform_keys(&:to_s)
        else
          value
        end
      end
    end

    def format_shutter_speed(exposure_time)
      if exposure_time >= 1
        "#{exposure_time.round(1)}s"
      else
        "1/#{(1.0 / exposure_time).round}"
      end
    end
  end

  class PhotoPage < Page
    def initialize(site, base, image_data, context_images, context_type, context_value = nil)
      @site = site
      @base = base
      
      # Set directory based on context
      case context_type
      when 'category'
        @dir = File.join('gallery', 'category', context_value, image_data['filename'])
      when 'year'
        @dir = File.join('gallery', 'year', context_value, image_data['filename'])
      else # 'main'
        @dir = File.join('gallery', image_data['category'], image_data['filename'])
      end
      
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'photo.html')

      # Set page data
      self.data['title'] = image_data['filename'].gsub(/[-_]/, ' ').split.map(&:capitalize).join(' ')
      self.data['photo_data'] = image_data
      self.data['layout'] = 'photo'
      self.data['context_type'] = context_type
      self.data['context_value'] = context_value

      # Find previous and next photos in the current context
      sorted_images = context_images.sort_by { |img| img['date_taken'] }.reverse!
      current_index = sorted_images.find_index { |img| img['filename'] == image_data['filename'] }

      if current_index
        if current_index < sorted_images.length - 1
          prev_img = sorted_images[current_index + 1]
          self.data['prev_photo'] = prev_img
          self.data['prev_photo_url'] = get_photo_url(prev_img, context_type, context_value)
        end
        
        if current_index > 0
          next_img = sorted_images[current_index - 1]
          self.data['next_photo'] = next_img
          self.data['next_photo_url'] = get_photo_url(next_img, context_type, context_value)
        end
      end
    end
    
    private
    
    def get_photo_url(image_data, context_type, context_value)
      case context_type
      when 'category'
        "/gallery/category/#{context_value}/#{image_data['filename']}/"
      when 'year'
        "/gallery/year/#{context_value}/#{image_data['filename']}/"
      else
        "/gallery/#{image_data['category']}/#{image_data['filename']}/"
      end
    end
  end

  class GalleryCategoryPage < Page
    def initialize(site, base, category, images)
      @site = site
      @base = base
      @dir = File.join('gallery', 'category', category)
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'gallery_index.html')

      category_title = category.gsub(/[-_]/, ' ').split.map(&:capitalize).join(' ')
      
      self.data['title'] = "#{category_title} Gallery"
      self.data['description'] = "Photos in the #{category_title} category"
      self.data['gallery_images'] = images
      self.data['filter_type'] = 'category'
      self.data['filter_value'] = category
      self.data['layout'] = 'gallery_index'
    end
  end

  class GalleryYearPage < Page
    def initialize(site, base, year, images)
      @site = site
      @base = base
      @dir = File.join('gallery', 'year', year)
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'gallery_index.html')

      self.data['title'] = "#{year} Gallery"
      self.data['description'] = "Photos from #{year}"
      self.data['gallery_images'] = images
      self.data['filter_type'] = 'year'
      self.data['filter_value'] = year
      self.data['layout'] = 'gallery_index'
    end
  end
end
