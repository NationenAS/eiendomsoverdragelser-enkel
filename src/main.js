import './app.css'
import App from './App.svelte'

const urlParams = new URLSearchParams(window.location.search)
let targetElement = document.querySelector('#Eiendomsoverdragelser-enkel')
let initialSale = urlParams.get('id') || null
let data = urlParams.get('data') || null
let title = urlParams.get('title') || null

const app = new App({
	target: targetElement,
	props: {
		initialSale: initialSale,
		data: data,
		title: title
	}
})

export default app