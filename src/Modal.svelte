<script>

import { createEventDispatcher } from 'svelte'
import Penger from "./Penger.svelte"
import Linjal from "./Linjal.svelte"
import Arrow from "./Arrow.svelte"

const dispatch = createEventDispatcher()
const close = () => { dispatch('close') }

export let activeSale

let hide = false

function expand() {
    this.nextElementSibling.style.display = "block"
    this.style.display = "none"
}

$: date = new Date(activeSale.sale.date)

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class=sale-modal class:closed="{hide}" >
    <div class=modal-nav>
        <svg on:click={() => { hide = !hide }} viewBox="0 0 10 10"><polyline points="1,5 9,5"></polyline></svg>
        <svg on:click={close} viewBox="0 0 10 10"><polyline points="1,9 9,1 5,5 1,1 9,9"></polyline></svg>
    </div>
    <h3>{ activeSale.sale.prop[0].address != null ? activeSale.sale.prop[0].address : activeSale.sale.prop[0].municipality }</h3>
    <div class=nat-hide class:nat-hidden="{hide}">
        {#if activeSale.sale.multiple}
        <div class="multiple">
            <span on:click={expand}>(Flere eiendommer)</span>
            <ul style="display: none;">
                {#each activeSale.sale.prop as property}
                <li>• {@html property.isPartOf ? "<em>Andel av</em> " : "" }{ property.address ? property.address : "Gnr./Bnr. " + property.matNumb.slice(5, -4) }</li>
                {/each}
            </ul>
        </div>
        {:else if activeSale.sale.prop[0].isPartOf}
        <div class=multiple>
            Overdragelsen gjelder en <em>andel av</em> eiendommen
        </div>
        {/if}
        <div class=pref>
            <Linjal />
            <div>{Math.round(activeSale.area / 1000).toLocaleString()} dekar</div>
            <Penger />
            <div>{(activeSale.sale.price).toLocaleString()} kr</div>
        </div>
        <div class=pref>
            <Arrow reverse={false} />
            <div>{activeSale.sale.fromto[0]}</div>
            <Arrow reverse={true} />
            <div>{activeSale.sale.fromto[1]}</div>
        </div>
        <div class=footer>
            {activeSale.sale.type} &bullet; {date.toLocaleDateString()}
        </div>
    </div>
</div>

<style>
.sale-modal {
    font-size: 16px;
    position: absolute;
    width: 240px;
    max-width: 50%;
    max-height: 500px;
    overflow: hidden;
    bottom: 30px;
    right: 30px;
    padding: 25px 30px;
    z-index: 10000;
    background: white;
    color: black;
    border-radius: 5px;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.35);
    transition: .4s ease-in;
    --vertical: 20px;
    line-height: 1.3;
}
.sale-modal.closed {
    overflow-y: hidden;
    max-height: 25px;
    transition: none;
}
h3 {
    margin: 0;
    font-size: 1.17em;
}
.nat-hide {
    transition: .2s .4s;
}
.nat-hide.nat-hidden {
    opacity: 0;
    transition: none;
}
.multiple {
    font-size: 0.85em;
    margin-top: 5px;
    line-height: 1.2;
}
span {
    text-decoration: underline;
    cursor: pointer;
}
span:hover {
    text-decoration: none;
}
ul {
    padding-left: 0;
    list-style: none;
}
li {
    line-height: 1.25;
}
.pref {
    margin-top: var(--vertical);
    display: grid;
    grid-template-columns: 45px 1fr;
    row-gap: calc(var(--vertical) / 2);
    align-items: center;
    font-size: .95em;
}
.modal-nav {
    float: right;
    cursor: pointer;
    height: 10px;
}
svg {
    width: 20px;
    margin-left: 10px;
}
svg:nth-child(2) {
    margin-left: 10px;
}
polyline {
    stroke: #666;
    stroke-width: 1.25px;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
}
svg:hover polyline {
    stroke: black;
    stroke-width: 1.5px;
}
.footer {
    margin-top:var(--vertical);
    opacity: 0.8;
    font-size: 0.9em;
    line-height: 1.15;
}
@media (max-width: 629px) {
    .sale-modal {
        left: 10px;
        bottom: 10px;
        right: 10px;
        max-width: unset;
        width: unset;
        --vertical: 10px;
    }
}

</style>