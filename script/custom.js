function get_imageName() {
	var imageSource = $('iframe').attr('src');
	var start = 26;
	var imageLength = 22;
	var end = imageSource.length - 26 - imageLength;
	imageName = imageSource.slice(start, -end);
}