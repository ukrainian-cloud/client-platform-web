import { Component } from '@ukrainian-cloud/utils';
import type { ComponentChildren } from 'preact';
import { forwardRef } from 'preact/compat';
import styles from './flexbox.module.sass';

enum FlexBoxDirection {
	row = 'row',
	rowReverse = 'rowReverse',
	column = 'column',
	columnReverse = 'columnReverse',
}

enum FlexBoxWrap {
	nowrap = 'nowrap',
	wrap = 'wrap',
	wrapReverse = 'wrapReverse',
}

interface FlexBoxProps {
	children?: ComponentChildren;
	direction?: FlexBoxDirection;
	wrap?: FlexBoxWrap;
}

function classes(...classNames: string[]) {
	return classNames.filter((v) => v).join(' ');
}

export const FlexBox = Component(
	'FlexBox',
	forwardRef<HTMLDivElement, FlexBoxProps>(({
		children,
		direction = FlexBoxDirection.row,
		wrap = FlexBoxWrap.nowrap,
	}, ref) => {
		return <div
			class={classes(
				styles.flexbox,
				styles[direction],
				styles[wrap],
			)}
			ref={ref}
		>
			{children}
		</div>;
	}), {
		Direction: FlexBoxDirection,
		Wrap: FlexBoxWrap,
	}
);
