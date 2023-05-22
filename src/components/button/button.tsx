import { Component } from '@ukrainian-cloud/utils';
import type { ComponentChildren } from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useCallback } from 'preact/hooks';
import { Spinner } from '../spinner';
import styles from './button.module.sass';

const { button, spinner } = styles;

interface ButtonProps {
	onClick: () => (void | Promise<void>);
	icon?: string;
	children?: ComponentChildren;
}

export const Button = Component(
	'Button',
	forwardRef<HTMLButtonElement, ButtonProps>(({ onClick, children }, ref) => {
		const [loading, setLoading] = useState(false);

		const handleClick = useCallback(async () => {
			setLoading(true);
			await onClick();
			setLoading(false);
		}, [setLoading]);

		return (
			<button
				class={button}
				onClick={handleClick}
				disabled={loading}
				ref={ref}
			>
				{ children }
				<Spinner variant={Spinner.Variant.monotone} class={spinner} style={{ opacity: loading ? 1 : 0 }}/>
			</button>
		);
	}),
);
