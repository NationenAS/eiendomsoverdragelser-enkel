<script>

export let reverse

</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.9 6.2" class:reverse="{reverse == true}"><polyline points="14.5 3.1 .3 3.1 3.1 .3 .3 3.1 3.1 5.9"/></svg>

<style>
    svg {
        width: 20px;
    }
    .reverse {
        transform: rotateZ(180deg)
    }
    polyline {
        fill:none;
        stroke:#d1002d;
        stroke-linecap:round;
        stroke-linejoin:round;
        stroke-width:.7px;}
    .reverse polyline {
        stroke: #2d4a08;
    }
</style>