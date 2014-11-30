# Phantom

Phantom is a simple and responsive theme for [Ghost](http://github.com/tryghost/ghost/). It's compatible with ```Ghost (0.5.2)``` and probably upwards, though this is the testet version.

Take a look at the live demo at: [http://bartinger.at](http://bartinger.at)

If you're using Phantom as your theme I would love to see it. Drop me the URL at [here](https://plus.google.com/+DominicBartl) or send me a [mail](mailto:dominic.bartl.at@gmail.com)

## Configuration
*  Google Analytics 

Edit [partials/analytics.hbs](https://github.com/Bartinger/phantom/blob/master/partials/analytics.hbs) and set parameters to `ga('create', ...)` call.

	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-21512134-2', 'bartinger.at');
		ga('send', 'pageview');
	</script>

*  Disqus

Edit [partials/disqus.hbs](https://github.com/Bartinger/phantom/blob/master/partials/disqus.hbs) and set `disqus_shortname`.

	<div id="disqus_thread"></div>
	<script type="text/javascript">
		var disqus_shortname = 'bartingerat';
		(function() {
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
	</script>
	<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>

*  Google Webmaster Tools

Edit [default.hbs](https://github.com/Bartinger/phantom/blob/master/default.hbs) and set your `content` value with a tag named `google-site-verification`.

	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="google-site-verification" content="2sFNa3r5M51jSBOmqrR7s9kJ6ohxsR5CNOkp4I0a2ho" />

	{{! Page Meta }}
	<title>{{meta_title}}</title>

*  Sidebar

Edit [partials/sidebar.hbs](https://github.com/Bartinger/phantom/blob/master/partials/sidebar.hbs) and fix the URLs and remove what's not needed.

	<div class="social-icons">
		<a href="https://github.com/Bartinger" class="icon icon-github"></a>
		<a href="https://plus.google.com/+DominicBartl?rel=author" class="icon icon-gplus"></a>
		<a href="https://twitter.com/DevBartinger" class="icon icon-twitter"></a>
		<a href="/rss" class="icon-rss"></a>
		<a href="mailto:dominic.bartl.at@gmail.com" class="icon-mail"></a>
	</div>



## Features
- Minimalistic responsive
- Google Analytics
- Disqus comments
- Icon-font ([Fontello](/assets/fonts/config.json))
- Post images*

* I've added them to the post.hbs template to make them discoverable by social sites if someone posts the link to this blog post. Though they are hidden in the template because I wanted to keep it clean. You can enable and style them by editing ```_posts.scss``` or ```standalone/assets/css/main.css``` for standalone users.

## SEO
- Post tags as meta keywords

## Development

### Dependencies

- Grunt
- Sass
- CSS minification
- Deployment via rsync

### Quickstart

```
git clone git@github.com:Bartinger/phantom.git
cd phantom
npm install
npm install -g grunt grunt-cli
bundle
```

### Notes

Using [Grunt](http://gruntjs.com) for development run ```gunt dev``` which watches the directory and does the ```sass``` compiling. *Note: Livereload extension must be installed, for it to work. I didn't include the connect middleware*.

To package the theme run ```grunt build``` and publish the new generated ```dist``` directory in your ghost theme directory. Run ```grunt compile``` to package the theme in the standalone directory.

## Grunt What?
Even though I highly recommend using Grunt, if you dont't know what it is and don't want to learn it (as a web developer you definitely should) you can use the standalone version. Take the ```standalone``` directory and copy it to your theme directory. It contains the whole theme with unminified css, ready for you to be edited.

This theme is based on the default theme casper.
![Desktop](screen_desktop.png "Desktop screenshot")
![Mobile](screen_mobile.png "Mobile screenshot")


## Copyright & License

Copyright (C) 2014 Dominic Bartl - Released under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
