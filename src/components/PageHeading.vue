<template>
	<NH2 prefix="bar" class="overflow-clip page-heading">
		<NText type="primary" class="inline-block">
			<slot></slot>
		</NText>
	</NH2>
</template>

<style>
	.page-heading {
		&,
		* {
			&,
			&::before,
			&::after {
				transition: all cubic-bezier(0, 0, 0, 1) 400ms 125ms !important;
			}
		}
	}

	@starting-style {
		.page-heading .n-text {
			translate: var(--n-prefix-width);
			opacity: 0;
		}

		.page-heading::before {
			scale: 1 0.5;
			opacity: 0;
		}
	}
</style>
