import ContentSchema from '../schemas/ContentSchema';
import BaseModel from './BaseModel';
import cheerio from 'cheerio';

export default class Content extends BaseModel {
	constructor() {
		super(ContentSchema);
	}

	render(template) {
		const $ = cheerio.load('<div class="wrapper"></div>', {
			normalizeWhitespace: false,
			xmlMode: true
		});

		const $wrapper = $('.wrapper');
		$wrapper.css({
			width: `${template.width}px`,
			height: `${template.height}px`,
			'background-color': template.backgroundColor,
			position: 'relative'
		});

		for (let i = 0; i < template.objects.length; i++) {
			const element = template.objects[i];
			const svg = Buffer.from(element.svg, 'base64').toString();

			$wrapper.append(`<svg class="svg-${i}" width="100%" height="100%">${svg}</svg>`);
			$(`.svg-${i}`).css({
				position: 'absolute',
				top: '0',
				left: '0',
			})
		}

		return $.html();
	}
}