<script>
let expand = false
</script>

<div class=help class:open="{expand}">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h4 on:click={() => { expand = !expand }}>
        <svg viewBox="0 0 15 8" height=8 width=15><polyline points="1,1 8,7 14,1" /></svg> Hvordan bruker jeg kartet?
    </h4>
    <div>
        <p>Klikk på markørene i kartet for å få mer informasjon om hvert enkeltsalg. Noen eiendommer kan ha flere markører, for eksempel i tilfeller hvor eiendommen(e) først arves og så selges på det åpne markedet.</p>
        <p>1 dekar er det samme som 1 <em>mål</em> eller 1000 kvadratmeter.</p>
    </div>
</div>

<style>
    .help {
        margin: 10px 0 15px;
    }
    svg {
        transition: .2s ease-in;
        stroke-width: 1.5px;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        stroke: black;
        margin: 0 5px 1px 0;
    }
    .help > div {
        display: none;
    }
    .help.open > div {
        display: block;
    }
    .help.open svg {
        transform: scale(-1);
    }
    h4 {
        font-family: adelle_sansregular, "Adelle Sans";   
        cursor: pointer;
        margin-bottom: 10px;
        margin-top: 0 !important;
    }
    p {
        margin-block: 10px !important;
        line-height: 1.35;
    }
</style>