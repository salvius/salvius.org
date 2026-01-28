require 'cgi'

module Jekyll
  class MerchantFeedGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # Get merchant feed configuration
      config = site.config['merchant_feed'] || {}

      # Check if feed generation is enabled
      unless config['enabled'] == true
        Jekyll.logger.info "Merchant Feed:", "Feed generation is disabled in config"
        return
      end

      # Get products data
      products = site.data['products']

      unless products && products.any?
        Jekyll.logger.warn "Merchant Feed:", "No products found in _data/products.yml"
        return
      end

      # Filter for in-stock products only
      active_products = products.select { |p| p['availability'] == 'in_stock' }

      if active_products.empty?
        Jekyll.logger.warn "Merchant Feed:", "No in-stock products found"
        return
      end

      Jekyll.logger.info "Merchant Feed:", "Generating feed for #{active_products.length} in-stock products"

      # Get configuration values
      output_path = config['output_path'] || 'merchant-feed.xml'
      base_url = config['base_url'] || site.config['url'] || 'https://salvius.org'

      # Generate the XML feed
      xml_content = generate_xml_feed(active_products, base_url, site)

      # Create the feed page
      feed_page = PageWithoutAFile.new(site, site.source, '', output_path)
      feed_page.content = xml_content
      feed_page.data['layout'] = nil

      site.pages << feed_page

      Jekyll.logger.info "Merchant Feed:", "Successfully generated #{output_path} with #{active_products.length} products"
    end

    private

    def generate_xml_feed(products, base_url, site)
      xml = []
      xml << '<?xml version="1.0" encoding="UTF-8"?>'
      xml << '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">'
      xml << '  <channel>'
      xml << "    <title>Salvius Robot Store</title>"
      xml << "    <link>#{escape_xml(base_url)}</link>"
      xml << "    <description>Products from Salvius Robot Store for Google Shopping</description>"

      products.each do |product|
        xml << '    <item>'
        xml << generate_product_item(product, base_url)
        xml << '    </item>'
      end

      xml << '  </channel>'
      xml << '</rss>'

      xml.join("\n")
    end

    def generate_product_item(product, base_url)
      item = []

      # Required fields
      item << "      <g:id>#{escape_xml(product['id'])}</g:id>"
      item << "      <g:title>#{escape_xml(product['title'])}</g:title>"
      item << "      <g:description>#{escape_xml(product['description'])}</g:description>"
      item << "      <g:link>#{escape_xml(product['link'])}</g:link>"
      item << "      <g:image_link>#{escape_xml(product['image_link'])}</g:image_link>"
      item << "      <g:price>#{product['price']} #{product['currency']}</g:price>"
      item << "      <g:availability>#{product['availability']}</g:availability>"
      item << "      <g:condition>#{product['condition']}</g:condition>"

      # Brand
      item << "      <g:brand>#{escape_xml(product['brand'])}</g:brand>" if product['brand']

      # Google product category
      if product['google_product_category']
        item << "      <g:google_product_category>#{escape_xml(product['google_product_category'])}</g:google_product_category>"
      end

      # Product type (custom categorization)
      item << "      <g:product_type>#{escape_xml(product['product_type'])}</g:product_type>" if product['product_type']

      # Book-specific fields
      if product['product_type'] == 'book'
        item << "      <g:gtin>#{escape_xml(product['gtin'])}</g:gtin>" if product['gtin']
        item << "      <g:isbn>#{escape_xml(product['isbn'])}</g:isbn>" if product['isbn']
      end

      # Hardware-specific fields
      if product['product_type'] == 'hardware'
        item << "      <g:mpn>#{escape_xml(product['mpn'])}</g:mpn>" if product['mpn']
      end

      # Additional image links
      if product['additional_image_links'] && product['additional_image_links'].any?
        product['additional_image_links'].each do |img_url|
          item << "      <g:additional_image_link>#{escape_xml(img_url)}</g:additional_image_link>"
        end
      end

      # Short title (for mobile)
      item << "      <g:short_title>#{escape_xml(product['short_title'])}</g:short_title>" if product['short_title']

      # Shipping weight
      item << "      <g:shipping_weight>#{escape_xml(product['shipping_weight'])}</g:shipping_weight>" if product['shipping_weight']

      item.join("\n")
    end

    def escape_xml(text)
      return '' if text.nil?
      CGI.escapeHTML(text.to_s)
    end
  end

  # Custom page class that doesn't require a file
  class PageWithoutAFile < Page
    def read_yaml(*)
      @data ||= {}
    end
  end
end
