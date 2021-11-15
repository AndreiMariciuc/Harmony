export default async function (component) {
	return (await import('../public/components/test/test.js')).default;
}
