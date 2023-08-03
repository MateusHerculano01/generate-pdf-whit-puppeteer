import { Router } from 'express';
import { compile } from 'handlebars';
import path from 'path';
import { unlink, readFile, readFileSync } from 'fs';
import { promisify } from 'util';
import puppeteer from 'puppeteer';


const appRoutes = Router();

const products = {
  name: "Celular",
  category: "Tech",
  price: "R$ 1.000",
}

appRoutes.get('/pdf', async (req, res) => {
  const htmlBuffer = await promisify(readFile)(
    path.join(__dirname, 'view', 'product', 'product-table.html'),
    'utf-8'
  );
  const filename = 'products-table.pdf'

  const template = compile(htmlBuffer, { strict: true });

  const html = template({ products });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.addStyleTag({ path: path.resolve(__dirname, 'view', 'product', 'product-table.css') });

  await page.pdf({
    path: filename,
    format: 'A4',
    displayHeaderFooter: true,
    headerTemplate: '<p></p>',
    footerTemplate:
      '<div style="color: #d0d0d0; font-weight: 400; font-size: 8px; margin-bottom: 8px; padding-right: 30px;text-align: right; width: 100%;"> \
        <p style="margin: 0; line-height: 2">Página de produtos.</p> \
        <span>Página </span><span class="pageNumber"></span> de <span class="totalPages"></span> \
      </div>'
  });

  // await browser.close();

  const bufferPdf = await promisify(readFile)(filename);
  await promisify(unlink)(filename);

  res.contentType("application/pdf");

  return res.send(bufferPdf);
})

export {
  appRoutes
}