<style lang="scss" src="./Progress.scss"></style>

<script>
export let progress = 0;
let circle;

$: {
    if(circle && progress) {
        circle.setAttribute('stroke-dasharray', Math.floor((progress * 100) * 157 / 100)  + ', 20000');
    }
}
</script>

{#if progress}
<circle bind:this={circle} cx="30" cy="30" r="25" fill="none" stroke="#fff" stroke-width="3" transform="rotate(-90, 30, 30)" stroke-dasharray="0,20000" ></circle>
{/if}

