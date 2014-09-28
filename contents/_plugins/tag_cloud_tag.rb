module Jekyll
  class TagCloudTag < Liquid::Tag
    safe = true
    
    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      html = ""
      tags = context.registers[:site].tags
      avg = tags.inject(0.0) {|memo, tag| memo += tag[1].length} / tags.length
      weights = Hash.new
      tags.each {|tag| weights[tag[0]] = tag[1].length/avg}
      tags.each do |tag, posts|
        html << "<a href='#{context.registers[:site].baseurl}/tags/#{tag}/' style='color: rgba(0,0,0,#{sprintf("%f",weights[tag]*10/50*1.5)})'>#{tag}</a>\n"
      end
      html
    end
  end
end

Liquid::Template.register_tag('tag_cloud', Jekyll::TagCloudTag)