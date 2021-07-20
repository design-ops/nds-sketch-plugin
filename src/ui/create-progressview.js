export default function createProgressBar(frame) {
	var progress = NSProgressIndicator.alloc().initWithFrame(frame)
	console.log(progress);
	for(item in progress) {
		console.log(item);
	}
	// progress.setIsBezeled(false)
	//progress.setIsIndeterminate(false)
	progress.isIndeterminate = false
	progress.startAnimation(true)
	// progress.usesThreadedAnimation = false
	progress.setDoubleValue(0.0)

	// console.log("doubleValue:", progress.doubleValue(), progress.minValue(), progress.maxValue());

	return progress
}
