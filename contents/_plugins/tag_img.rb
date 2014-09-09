module Jekyll
  class RenderImgTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @url , *@val= text.split(/ /)
      if @val.length > 0
          @width , *@height = @val[0].split(/x/)

          @img_style = "width:#{@width}px;"

          if @height.length > 0
            @img_style = @img_style + "height:#{@height[0]}px;"
          end
      end
    end

    def render(context)
      "<img src=\"#{@url}\" style=\"#{@img_style}\">"
    end
  end
end

Liquid::Template.register_tag('img', Jekyll::RenderImgTag)

module Jekyll
  class RenderImgBlock < Liquid::Block

    def initialize(tag_name, text, tokens)
      super
      @url , *@val= text.split(/ /)
      if @val.length > 0
          @width , *@height = @val[0].split(/x/)

          @img_style = "width:#{@width}px;"

          if @height.length > 0
            @img_style = @img_style + "height:#{@height[0]}px;"
          end
      end
    end

    def render(context)
      "<img src=\"#{@url}\" style=\"#{@img_style}\" alt=\"#{super}\" title=\"#{super}\">"
    end
  end
end

Liquid::Template.register_tag('bimg', Jekyll::RenderImgBlock)