import path from 'path';

const __dirname = path.resolve();
const fileLocation = 'public';

async function sendView(res, fileName) {
	if (!fileName.endsWith('.html')) fileName = fileName + '.html';

	const options = {
		root: path.join(__dirname, fileLocation),
	};

	await res.sendFile(fileName, options, err => {
		if (err) {
			console.log(err);
		} else {
			// console.log('File sent successfully!');
		}
	});
}

export { sendView };
