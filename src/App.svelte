<script>

import { onMount } from "svelte"
// @ts-ignore
import { each } from "svelte/internal"
// @ts-ignore
import * as L from "leaflet"
// @ts-ignore
import { MarkerClusterGroup } from 'leaflet.markercluster';
import * as turf from "@turf/turf"
import Modal from "./Modal.svelte"
import Locate from "./Locate.svelte"
import Lock from "./Lock.svelte"

export let initialSale
export let data
export let title

let map,
	sales = [], // Data array with sales objects
	activeSalePolygons = L.featureGroup(),
	salesMarkerGroup = new MarkerClusterGroup({ showCoverageOnHover: false, zoomToBoundsOnClick: true }),
	showModal = false,
	locked = false,
	// @ts-ignore
	isMobile = L.Browser.mobile,
	saleIcon = L.divIcon({ className: 'map-marker', html: '<svg><use xlink:href="#saleIcon"></svg>' })
$:	activeSale = {}

// Map setup
function createMap(container) {
    map = L.map(container)
		.setView([61, 9], 7)
	setLock(true)
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map)
}
function populateMap(callback) {
	// Reset
	salesMarkerGroup.clearLayers().remove()
	// Create sale markers and list
	for (let sale of sales) {
		if(sale.prop[0].coord != null) { // TODO!!
			let layer = L.marker(sale.prop[0].coord, {
					icon: saleIcon
				})
				.on('click', () => {
					markerClick(sale.saleId)
					console.log("SaleId: " + sale.saleId)
				})
			layer.addTo(salesMarkerGroup)
		}
	}
	// Add to map
	salesMarkerGroup.addTo(map)
	// Focus initial sale on map
	if (initialSale != null) {
		markerClick(initialSale)
	}
	if (typeof callback == "function") callback()
}
function resizeMap() { if (map) { map.invalidateSize() } }
function zoomToBounds() { map.fitBounds(salesMarkerGroup.getBounds()) }

// Get data
onMount(async () => {
	if (data != null) {
		fetch(`https://nationenmedia.s3.eu-north-1.amazonaws.com/statisk/eiendommer/${data}.json`)
		.then(r => r.json())
		.then(d => {
			sales = d
			populateMap(zoomToBounds)
		})
		.catch(e => { console.log(e) })
	}
	else {
		fetch("https://api.nationen.no/kart/sales.json")
		.then(r => r.json())
		.then(d => {
			sales = d
			populateMap()
		})
		.catch(e => { console.log(e) })
	}
})

// Actions
function markerClick(saleId) {
	// Find array index from SaleId, abort if not found
	let i = sales.findIndex(x => x.saleId == saleId)
	if (i == -1) return
	// Reset
	if (activeSalePolygons.getLayers() != null) activeSalePolygons.clearLayers().remove()
	// @ts-ignore
	activeSale = {}
	// Register properties which share area/teig to prevent area duplicates
	let matNumbTexts = []
	// Make layer group and add to map
	activeSalePolygons.addTo(map).on('layeradd', () => {
		map.flyToBounds(activeSalePolygons.getBounds(), {
			duration: 1
		})
	})
	// Add markers to group
	sales[i].prop.forEach(p => {
		fetch("https://ws.geonorge.no/eiendom/v1/geokoding?matrikkelnummer=" + p.matNumb + "&omrade=true&utkoordsys=4326")
			.then(r => r.json())
			.then(data => {
				// Create marker if has geo and is not duplicate
				if(data.features.length > 0 && !matNumbTexts.includes(data.features[0].properties.matrikkelnummertekst)) {
                    // Takes all features of all matrikkelnumbers, union area, and update area calculation
                    data.features.forEach(e => {
                        if (!activeSale.features) activeSale.features = e
                        else activeSale.features = turf.union(activeSale.features, e)
                        activeSale.area = turf.area(activeSale.features)
                    })
					L.geoJSON(data, { style: { color: "red", fillOpacity: 0.4, weight: 0, } })
						.bindPopup(() => {
							let txt = p.matNumb + "<br>" + Math.round(turf.area(data) / 1000) + " dekar" // Area of feature or feature collection (all features in matrikkelnumber)
							if (p.address) txt = p.address + "<br>" + txt
							return txt
						})
						.addTo(activeSalePolygons)
					matNumbTexts.push(data.features[0].properties.matrikkelnummertekst)
				}
			})
	})
	// @ts-ignore
	activeSale.sale = sales[i]
	showModal = true
}
function closeModal() { 
	showModal = !showModal
	let center = map.getCenter()
	activeSalePolygons.clearLayers().remove()
	if (map.getZoom() > 10) map.flyTo(center, 10, { duration: 0.5 })
}
function locateUser() {
	showModal = false
	map.locate({setView: true, maxZoom: 9});
}
function setLock(state) {
	if (state) {
		map._handlers.forEach((h) => { h.disable() })
		locked = true
	} else {
		map._handlers.forEach((h) => { h.enable() })
		locked = false
	}
}

</script>
<svelte:window on:resize={resizeMap} />
<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true">
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<main>
{#if title != null}
<div>
	<h2>{title}</h2>
</div>
{/if}

<div class="map-container">
	<div class="map" use:createMap>
		{#if showModal}<Modal {activeSale} on:close={closeModal} />{/if}
		<Locate on:locate={locateUser} />
		<Lock on:toggleLock={(event) => { setLock(event.detail.state) }} {locked} />
	</div>
</div>

<div class="description">
	Beregnet eiendomsareal kan avvike noe fra faktisk areal. Informasjon/kartdata om eiendommene leveres av Kartverket.
</div>

</main>

<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
	<symbol id="saleIcon" viewBox="0 0 23 33.6">
		<path d="M11.5,0c6.3-.1,12,6.1,11.5,12.5-.1,3.2-2,5.8-3.5,8.5-2.1,3.7-6.7,11.8-7,12.1-.5,.8-1.7,.7-2.1,0-.5-.9-5.8-10-7.9-13.7C1.3,17.3,.1,15,0,12.6-.5,6.2,5.1,0,11.5,0c0,0,0,0,0,0ZM6.4,12c0,2.9,2.3,5,4.8,5.1,7.2,0,7.2-10.2,.2-10.3-2.6,0-5,2.3-5,5.1Z"/>
	</symbol>
</svg>

<style>
main {
	font-family: "Open Sans", sans-serif;
	font-size: 15px;
	clear: both;
	line-height: 1.35;
}
h2 {
    font-family: "Open Sans";
    font-size: 22px;
    margin-bottom: 15px;
}
.map-container {
	position: relative;
}
.map {
	height: 480px;
}
.description {
	margin: 10px auto;
	font-size: 0.8em;
	color: #666;
	line-height: 1.25;
}
</style>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css">