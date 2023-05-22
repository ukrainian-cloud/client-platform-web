import { Component } from '@ukrainian-cloud/utils';
import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import styles from './spinner.module.sass';

const { spinner, path, variantColorful, variantMonotone } = styles;

enum SpinnerVariant {
	monotone = 0,
	colorful = 1,
}

interface SpinnerProps {
	variant?: SpinnerVariant;
	class?: string;
	style?: JSX.CSSProperties;
}

const variableClasses = {
	[SpinnerVariant.monotone]: variantMonotone,
	[SpinnerVariant.colorful]: variantColorful,
};

export const Spinner = Component(
	'Spinner',
	forwardRef<SVGSVGElement, SpinnerProps>(({
		variant = SpinnerVariant.colorful,
		class: className,
		style,
	}, ref) => {
		return <svg class={`${className} ${spinner} ${variableClasses[variant]}`} width='100%' height='100%' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg' style={style} ref={ref}>
			<circle class={path} fill='none' stroke-width='10' stroke-linecap='round' cx='33' cy='33' r='30'></circle>
		</svg>;
	}),
	{
		Variant: SpinnerVariant,
	},
);
