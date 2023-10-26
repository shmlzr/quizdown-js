<script lang="ts">
    import type { Quiz } from '../quiz';
    import { onMount, beforeUpdate } from 'svelte';

    export let quiz: Quiz;
    let emojis = ['🌡️🌍🥵', '🌱🌍♻️'];
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import Icon from './Icon.svelte';
    import Loading from './Loading.svelte';
    import { get } from 'svelte/store';
    import postscribe from 'postscribe';

    let waitTime = 800;
    if (get(quiz.isEvaluated)) {
        waitTime = 300;
    }
    let points = 0;
    beforeUpdate(() => (points = quiz.evaluate()));

    onMount(() => {
    // Check if the script container already exists in the DOM
    let scriptContainer = document.getElementById('scriptContainer');

    // If it doesn't exist, create and append it
    if (!scriptContainer) {
        scriptContainer = document.createElement('div');
        scriptContainer.id = 'scriptContainer';
        document.body.appendChild(scriptContainer);

        postscribe('#scriptContainer', '<script src="//www.germanwatch.org/de/webform/newsletter_abo/share.js"><\/script>');
    }
    });

    function format(n: number) {
        return n.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
        });
    }
    
</script>

<h3>{$_('resultsTitle')}</h3>
<Loading ms="{waitTime}" minHeight="{150}">
    <div in:fade="{{ duration: 1000 }}">
        <h1>
            <Icon name="check-double" />
            {format(points)}/{format(quiz.questions.length)}
        </h1>

        <ol>
            {#each quiz.questions as question, i}
                <li class="top-list-item" on:click="{() => quiz.jump(i)}">
                    <span class="list-question">
                        {emojis[+question.solved]}
                        {@html question.text}
                    </span>
                    <ol>
                        {#each question.selected as selected}
                            {#if question.answers[selected].comment !== ''}
                                <li class="list-comment">
                                    <i>{@html question.answers[selected].html}</i>:
                                    {@html question.answers[selected].comment}
                                </li>
                            {/if}
                        {/each}
                    </ol>
                </li>
            {/each}
        </ol>
    </div>
</Loading>

<!-- Container for the postscribe script -->
<div id="scriptContainer"></div>

<style>
    ol {
        padding-left: 0;
        display: inline-block;
    }

    .top-list-item {
        margin-bottom: 0.2rem;
        list-style-type: none;
        list-style: none;
    }

    .top-list-item:hover {
        cursor: pointer;
        background-color: var(--quizdown-color-secondary);
    }

    .top-list-item:hover .list-question {
        text-decoration: underline;
    }

    .list-comment {
        margin-left: 2em;
        list-style-type: initial;
    }
</style>
