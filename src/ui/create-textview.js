export default function createTextView(theme,color,colorDark,font,string,frame) {
	
	var textview = NSTextView.alloc().initWithFrame(frame)

	textview.string = string
	textview.setFont(font)
	textview.setEditable(0)

	//Themes colors
	if (theme === 'dark') {
  	textview.setTextColor(colorDark)
	} else {
  	textview.setTextColor(color)
	}

	return textview
}
