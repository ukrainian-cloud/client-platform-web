import * as preact from 'preact';
import { Component, ComponentChildren, JSX } from 'preact';
import { MutableRef } from 'preact/hooks';
import { LocalDB, ColorScheme, LocalDBEnum } from '@ukrainian-cloud/utils';

declare class App extends Component<{
    children: ComponentChildren;
}> {
    render(): ComponentChildren;
    static create(children: ComponentChildren): void;
}

declare enum FlexBoxDirection {
    row = "row",
    rowReverse = "rowReverse",
    column = "column",
    columnReverse = "columnReverse"
}
declare enum FlexBoxWrap {
    nowrap = "nowrap",
    wrap = "wrap",
    wrapReverse = "wrapReverse"
}
interface FlexBoxProps {
    children?: ComponentChildren;
    direction?: FlexBoxDirection;
    wrap?: FlexBoxWrap;
}
declare const FlexBox: preact.FunctionalComponent<Omit<FlexBoxProps, "ref"> & {
    ref?: preact.Ref<HTMLDivElement> | undefined;
}> & {
    Direction: typeof FlexBoxDirection;
    Wrap: typeof FlexBoxWrap;
};

interface FlexChildProps {
    ref?: MutableRef<unknown>;
    children: ComponentChildren;
    basis?: string;
    grow?: number;
    shrink?: number;
}
declare const FlexChild: preact.FunctionalComponent<FlexChildProps>;

interface ButtonProps {
    onClick: () => (void | Promise<void>);
    icon?: string;
    children?: ComponentChildren;
}
declare const Button: preact.FunctionalComponent<Omit<ButtonProps, "ref"> & {
    ref?: preact.Ref<HTMLButtonElement> | undefined;
}>;

declare enum SpinnerVariant {
    monotone = 0,
    colorful = 1
}
interface SpinnerProps {
    variant?: SpinnerVariant;
    class?: string;
    style?: JSX.CSSProperties;
}
declare const Spinner: preact.FunctionalComponent<Omit<SpinnerProps, "ref"> & {
    ref?: preact.Ref<SVGSVGElement> | undefined;
}> & {
    Variant: typeof SpinnerVariant;
};

declare class LocalDBWebImpl extends LocalDB {
    private db;
    private runTransaction;
    init(): Promise<void>;
    get(name: string): Promise<any>;
    set(name: string, value: unknown): Promise<void>;
    delete(name: string): Promise<void>;
}

declare class ClolorSchemeWebImpl extends ColorScheme {
    getDefault(): Promise<LocalDBEnum<'Theme'>>;
}

type index_ClolorSchemeWebImpl = ClolorSchemeWebImpl;
declare const index_ClolorSchemeWebImpl: typeof ClolorSchemeWebImpl;
type index_LocalDBWebImpl = LocalDBWebImpl;
declare const index_LocalDBWebImpl: typeof LocalDBWebImpl;
declare namespace index {
  export {
    index_ClolorSchemeWebImpl as ClolorSchemeWebImpl,
    index_LocalDBWebImpl as LocalDBWebImpl,
  };
}

export { App, Button, FlexBox, FlexChild, Spinner, index as utils };
