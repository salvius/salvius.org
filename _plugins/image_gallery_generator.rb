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

      # Create arrays to store image data
      images = []

      # Scan for images in top-level subdirectories only
      Dir.glob(File.join(image_dir, '*/')).each do |category_dir|
        next unless File.directory?(category_dir)

        category_name = File.basename(category_dir)

        # Skip certain directories
        next if ['generated', '.', '..'].include?(category_name)

        # Find all JPEG images in this category
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

          # Create individual page for this image
          create_photo_page(site, image_data, images)
        end
      end

      # Sort images by date (newest first)
      images.sort_by! { |img| img['date_taken'] }.reverse!

      # Make available to all pages via site.data
      site.data['gallery_images'] = images

      # Group by year and category for easy filtering
      site.data['images_by_year'] = images.group_by { |img| img['year'] }
      site.data['images_by_category'] = images.group_by { |img| img['category'] }

      Jekyll.logger.info "Gallery:", "Generated #{images.length} photo pages across #{site.data['images_by_category'].keys.length} categories"
    end

    private

    def create_photo_page(site, image_data, all_images)
      # Create a new page for this photo
      page = PhotoPage.new(site, site.source, image_data, all_images)
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

      data
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
    def initialize(site, base, image_data, all_images)
      @site = site
      @base = base
      @dir = File.join('gallery', image_data['category'])
      @name = "#{image_data['filename']}.html"

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'photo.html')

      # Set page data
      self.data['title'] = image_data['filename'].gsub(/[-_]/, ' ').split.map(&:capitalize).join(' ')
      self.data['photo_data'] = image_data
      self.data['layout'] = 'photo'

      # Find previous and next photos in the same category
      category_images = all_images.select { |img| img['category'] == image_data['category'] }
      category_images.sort_by! { |img| img['date_taken'] }.reverse!

      current_index = category_images.find_index { |img| img['filename'] == image_data['filename'] }

      if current_index
        self.data['prev_photo'] = category_images[current_index + 1] if current_index < category_images.length - 1
        self.data['next_photo'] = category_images[current_index - 1] if current_index > 0
      end
    end
  end
end
