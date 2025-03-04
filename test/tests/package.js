const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const KEY = require('selenium-webdriver').Key;

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('package', () => {
	it('displays default file', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await expect(browser.findElement({ css: '.file-path' }).getText()).to.eventually.contain('index.min.js');
	});

	it('opening directories works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.c-package-file-browser .box-content-wrapper .files-list .file-item:nth-child(2) a' }).click();
		await expect(browser.findElement({ css: '.box-content-wrapper .files-list .file-item:nth-child(3) a .file-path' }).getText()).to.eventually.equal('demos/api_demo.js');
	});

	it('going up in directories works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2&path=demos`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.c-package-file-browser .box-content-wrapper .files-list .files-list-back a' }).click();
		await expect(browser.findElement({ css: '.box-content-wrapper .files-list .file-item:nth-child(2) > a .file-path' }).getText()).to.eventually.equal('demos');
	});

	it('opening files works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2&path=demos`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.box-content-wrapper .files-list .file-item:nth-child(4) > a' }).click();
		let tabs = await browser.getAllWindowHandles();
		await browser.switchTo().window(tabs[1]);
		await expect(browser.findElement({ css: 'pre' }).getText()).to.eventually.have.lengthOf.at.least(1);
		await browser.close();
		await browser.switchTo().window(tabs[0]);
	});

	it('changing versions works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.version-dropdown-selected-version' }).click();
		await browser.sleep(1000);
		await browser.findElement({ css: '.dropdown-menu-right li:last-of-type a' }).click();
		await browser.sleep(4000);
		await expect(browser.findElement({ css: '.box-content-wrapper .files-list .file-item:nth-child(8) > a .file-path' }).getText()).to.eventually.equal('index.js');
	});

	it('copying url works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.box-content-wrapper .file-item:nth-child(5) .c-copy-dropdown span' }).click();
		await browser.sleep(1000);
		await browser.findElement({ css: '.box-content-wrapper .file-item:nth-child(5) .dropdown-menu a' }).click();
		await browser.sleep(1000);
		await browser.executeScript(`let ele = document.createElement('input'); ele.setAttribute('id', 'testInput'); document.body.appendChild(ele)`);
		await browser.findElement({ css: '#testInput' }).sendKeys(KEY.CONTROL, 'v');
		await browser.sleep(1000);
		await expect(browser.findElement({ css: '#testInput' }).getAttribute('value')).to.eventually.equal('https://cdn.jsdelivr.net/npm/jsdelivr@0.1.2/.jshintrc');
		await browser.executeScript(`let ele = document.querySelector('#testInput'); ele.parentNode.removeChild(ele)`);
	});

	it('adding files to collection works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.box-content-wrapper .file-item:nth-of-type(8) label' }).click();
		await browser.findElement({ css: '.box-content-wrapper .file-item:nth-of-type(9) label' }).click();
		await browser.sleep(1000);
		await browser.findElement({ css: '.c-collection-box .config-btn' }).click();
		await browser.sleep(1000);
		await expect(browser.findElement({ css: '.c-collection-links .collection-link:nth-of-type(3) a' }).getText()).to.eventually.equal('https://cdn.jsdelivr.net/npm/jsdelivr@0.1.2/demo.min.js');
	});

	it('removing all files from collection works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.findElement({ css: '.box-content-wrapper .file-item:nth-of-type(5) label' }).click();
		await browser.findElement({ css: '.box-content-wrapper .file-item:nth-of-type(6) label' }).click();
		await browser.sleep(1000);
		await browser.executeScript(`arguments[0].click();`, await browser.findElement({ css: '.collection-header .remove-text' }));
		await browser.sleep(1000);
		await expect(browser.findElement({ css: '.c-collection-box .collection-list .box-message' }).getText()).to.eventually.equal('No files selected. Select the files you want to use using the switches on the left.');
	});

	it('show all files works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/jsdelivr?version=0.1.2`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteFiles' }).click();
		await browser.sleep(4000);
		await browser.findElement({ css: '.c-package-file-browser .show-more-toggle a' }).click();
		await browser.sleep(1000);
		await expect(browser.findElement({ css: '.c-package-file-browser .files-list > div:nth-child(12) .file-item .file-path' }).getText()).to.eventually.contain('README.md');
	});

	it('top files switching versions works', async () => {
		await browser.navigate().to(`${BASE_URL}/package/npm/slick-carousel?version=1.8.1`);
		await browser.sleep(4000);
		await browser.findElement({ id: 'tabRouteStats' }).click();
		await browser.sleep(4000);
		let version = await browser.findElement({ css: '.c-top-stats-table:nth-child(1) .table-row:nth-child(2) a' }).getText();
		await browser.findElement({ css: '.c-top-stats-table:nth-child(1) .table-row:nth-child(2) a' }).click();
		await browser.sleep(4000);
		await expect(browser.findElement({ css: '.c-top-stats-table:nth-child(2) .version-dropdown-selected-version a' }).getText()).to.eventually.equal(version);
	});
});
