<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	function locate() {
        dispatch('locate')
	}
</script>

<button on:click={locate}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <circle class="stroke" cx="15" cy="15" r="9"/>
        <line class="stroke" x1="15" y1="24" x2="15" y2="29"/>
        <line class="stroke" x1="15" y1="6" x2="15" y2="1"/>
        <line class="stroke" x1="6" y1="15" x2="1" y2="15"/>
        <line class="stroke" x1="29" y1="15" x2="24" y2="15"/>
        <circle cx="15" cy="15" r="5"/>
    </svg>
</button>

<style>
    button {
        position: absolute;
        left: 10px;
        top: 82px;
        width: 34px;
        height: 34px;
        background: white;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        border: 2px solid rgba(0,0,0,0.35);
        cursor: pointer;
    }
    button:hover {
        background:#f4f4f4;
    }
    svg {
        width: 20px;
        height: 20px;
    }
    .stroke {
        fill:none;
        stroke:#000;
        stroke-linecap:round;
        stroke-linejoin:round;
        stroke-width:1.5px;
    }
</style>