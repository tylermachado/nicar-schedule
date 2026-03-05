<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

  	// import savedSessionsStore from "$stores/savedSessions";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
