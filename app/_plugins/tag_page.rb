module Jekyll
  class TagPage
    include Convertible
    attr_accessor :site, :pager, :name, :ext
    attr_accessor :basename, :dir, :data, :content, :output

    def initialize(site, tag, posts)
      @site = site
      @tag = tag
      self.ext = '.html'
      self.basename = 'index'
      self.content = <<-EOS
{% for post in page.posts %}
<div class="shadow_panel media_content media_item">
<span class="list_item_title"><a href="{{ post.url }}">{{ post.title }}</a></span>

<p>{{ post.summary }}</p>

<p>
{% if post.author != empty %}
<img src="{{ site.data.authors[post.author].img }}" class="img-circle profile_img_small">
{{ site.data.authors[post.author].name }}
가 {{ post.date | date: "%y.%m.%d" }}에 작성.
{% endif %}
{% if post.categories != empty %}
In <a href="/{{ post.categories | array_to_sentence_string }}">{{ post.categories | array_to_sentence_string }}</a>.
{% endif %}
{% if post.tags != empty %}
Tagged {{ post.tags | array_to_sentence_string }}.
</p>
{% endif %}
</div>
{% endfor %}
EOS
      self.data = {
        'layout' => 'tag_list',
        'type' => 'tag',
        'title' => "Posts tagged #{@tag}",
        'posts' => posts
      }
    end

    def render(layouts, site_payload)
      payload = Utils.deep_merge_hashes({
        "page" => to_liquid,
        'paginator' => pager.to_liquid
      }, site_payload)

      do_layout(payload, layouts)
    end

    def path
      data.fetch('path', relative_path.sub(/\A\//, ''))
    end

    # The path to the page source file, relative to the site source
    def relative_path
      File.join(*[@dir, @name].map(&:to_s).reject(&:empty?))
    end

    # Obtain destination path.
    #
    # dest - The String path to the destination dir.
    #
    # Returns the destination file path String.
    def destination(dest)
      path = Jekyll.sanitized_path(dest, URL.unescape_path(url))
      path = File.join(path, "index.html") if url =~ /\/$/
      path
    end


    def url
      File.join("/tags", @tag, "index.html")
    end

    def to_liquid
      Utils.deep_merge_hashes({
        "url" => self.url,
        "content" => self.content
      }, self.data)
    end

    def write(dest_prefix, dest_suffix = nil)
      dest = dest_prefix
      dest = File.join(dest, dest_suffix) if dest_suffix
      path = File.join(dest, CGI.unescape(self.url))
      FileUtils.mkdir_p(File.dirname(path))
      File.open(path, 'w') do |f|
        f.write(self.output)
      end
    end

    def html?
      true
    end
  end
end