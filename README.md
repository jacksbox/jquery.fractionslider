# jQuery fractionslider

Originally created by [Mario Jäckle](https://github.com/jacksbox).

Modified to allow the previous slide to fade out, instead of just hiding it. It has been awhile since this repo was updated, so I will continue to add new features as I need them. If you would like a feature added, just create an issue and I'll do my best to make it happen. I will also accept pull requests.

```html
<script>
jQuery(window).load(function(){
  $('.slider').fractionSlider({
  	'slideEndAnimation' : false,
  	'backgroundAnimation' : false, 
  	'controls' : false,
  	'prevSlideFadeOut' : true,
  	'prevSlideFadeOutSpeed' : 2000});
});
</script>
```
