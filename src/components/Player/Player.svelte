<style lang="scss" src="./Player.scss"></style>

<script>
import Progress from '../Progress/Progress.svelte';

import { onDestroy } from 'svelte';

import { activeSample } from '../../store';

export let src;

let playing = false;
let audio;
let progress;
let raf = window.requestAnimationFrame(onUpdate);

onDestroy(() => {
    if (raf) {
        window.cancelAnimationFrame(raf);
    }
});

activeSample.subscribe((value) => {
    if (playing && value !== src) {
        stop();
    }
});

function onUpdate() {
    progress = audio.currentTime / audio.duration;

    if (playing) {
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(onUpdate);
    }
}

function toggle() {
    if (playing) {
        pause();
        return;
    }

    play();
}

function play() {
    audio.play();
    raf = window.requestAnimationFrame(onUpdate);
    playing = true;
    if (src !== $activeSample) {
        activeSample.set(src);
    }
}

function pause() {
    audio.pause();
    window.cancelAnimationFrame(raf);
    raf = null;
    playing = false;
}

function stop() {
    pause();
    audio.currentTime = 0;
    progress = 0;
}
</script>

<div on:click|preventDefault|stopPropagation={toggle} role="button" tabindex="0" class="player">
    <div class="speaker__play player">
        <div class="player__button">
            <svg
                width="36"
                height="36"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {#if !playing}
                    <circle cx="30" cy="30" r="29" stroke-width="2" />
                    <path
                        d="M42.5 31.0199C43.1667 30.635 43.1667 29.6727 42.5 29.2878L24.7308 19.0287C24.0641 18.6438 23.2308 19.125 23.2308 19.8948L23.2308 40.4129C23.2308 41.1827 24.0641 41.6638 24.7308 41.2789L42.5 31.0199Z"
                    />
                {:else}
                    <circle cx="30" cy="30" r="29" stroke-width="2" />
                    <rect y="21" x="23" width="4.5" height="18" />
                    <rect y="21" x="33.8003" width="4.5" height="18" />
                {/if}
                <Progress {progress} />
            </svg>
        </div>
    </div>
    <audio class="visually-hidden" bind:this={audio} {src} controls on:ended={stop} />
</div>
