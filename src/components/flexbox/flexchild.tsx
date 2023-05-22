import { Component } from '@ukrainian-cloud/utils';
import type { ComponentChildren } from 'preact';
import { useRef, useEffect, MutableRef } from 'preact/hooks';

interface FlexChildProps {
	ref?: MutableRef<unknown>;
	children: ComponentChildren;
	basis?: string;
	grow?: number;
	shrink?: number;
}

export const FlexChild = Component(
	'FlexChild',
	({ children, basis, grow, shrink, ref }: FlexChildProps) => {
		const realRef = ref || useRef();
		useEffect(() => {
			if (!realRef?.current) return;
			const element = realRef.current as HTMLElement;
			element.style.flexBasis = String(basis);
			element.style.flexGrow = String(grow);
			element.style.flexShrink = String(shrink);
		}, [realRef]);
		if (typeof children !== 'object') {
			throw new Error('FlexChild should have exactly 1 DOM element in children. Found the only non-DOM child');
		}
		const [child] = Array.isArray(children) ? children : [children];
		child.props.ref = realRef;
		return <>{child}</>;
	},
);
