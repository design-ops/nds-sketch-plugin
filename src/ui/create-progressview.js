export default function createProgressBar(frame) {
	var progress = NSProgressIndicator.alloc().initWithFrame(frame)
	console.log(progress);
	// progress.setIsBezeled(false)
	// progress.setIsIndeterminate(false)
	progress.startAnimation(true)
	progress.setMinValue(0)
	progress.setMaxValue(100)
	progress.setDoubleValue(50.0)
	progress.setValue(50.0)

	return progress
}