// import { getMetadata } from '../../scripts/aem.js';
import { isAuthorEnvironment, moveInstrumentation } from '../../scripts/scripts.js';

/**
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  // Note: Hard-coded
  const aemauthorurl = 'https://author-p128352-e1258333.adobeaemcloud.com';
  const aempublishurl = 'https://publish-p128352-e1258333.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/general-motors/teaserByPath';

  const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();

  const variationname =
    block
      .querySelector(':scope div:nth-child(2) > div')
      ?.textContent?.trim()
      ?.toLowerCase()
      ?.replace(' ', '_') || 'master';
  block.innerHTML = ``;
  const isAuthor = isAuthorEnvironment();
  const url = window?.location?.origin?.includes('author')
    ? `${aemauthorurl}${persistedquery};path=${contentPath};variation=${variationname};ts=${
        Math.random() * 1000
      }`
    : `${aempublishurl}${persistedquery};path=${contentPath};variation=${variationname};ts=${
        Math.random() * 1000
      }`;
  const options = { credentials: 'include' };

  const cfReq = await fetch(url, options)
    .then((response) => response.json())
    .then((contentfragment) => {
      let data = '';
      if (contentfragment.data) {
        data = contentfragment.data[Object.keys(contentfragment.data)[0]].item;
      }
      return data;
    });
  const itemId = `urn:aemconnection:${contentPath}/jcr:content/data/${variationname}`;

  block.setAttribute('data-aue-type', 'container');
  block.innerHTML = `
  <div class='block' data-aue-resource=${itemId} data-aue-label='card content fragment' data-aue-type='reference' data-aue-filter='cf'>
		<div class='card-body-content'>
        <h4 data-aue-prop='title' data-aue-label='title' data-aue-type='text' class='heading'>${
          cfReq?.title
        }</h4>
        <p data-aue-prop='description' data-aue-label='description' data-aue-type='richtext' class='description'>${
          cfReq?.description?.plaintext
        }</p>
        <p data-aue-prop='cta' data-aue-label='cta' data-aue-type='text' class='cta-link'>
          <a class='button primary' href='${cfReq?.ctaUrl}' target='_blank'>${cfReq?.ctaLabel}</a>
        </p>
    </div>
    <div class='card-body-image'>
        <img src='${cfReq?.image?._publishUrl}' title='${cfReq?.title}'/>
    </div>
  </div>
	`;
  if (!isAuthor) {
    moveInstrumentation(block, null);
    block.querySelectorAll('*').forEach((elem) => moveInstrumentation(elem, null));
  }
}