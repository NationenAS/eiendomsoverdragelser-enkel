import App from './App.svelte'

const urlParams = new URLSearchParams(window.location.search)
let targetElement = document.querySelector('#Eiendomsoverdragelser')
let initialSale = targetElement.dataset.sale || urlParams.get('id') || null
let data = targetElement.dataset.custom ? JSON.parse(targetElement.dataset.custom) : null
let title = targetElement.dataset.title ? targetElement.dataset.title : null

const app = new App({
	target: targetElement,
	props: {
		initialSale: initialSale,
		data: data,
		title: title
	}
})

export default app