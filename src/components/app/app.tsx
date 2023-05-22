import { Component, ComponentChildren, render } from 'preact';

const root = document.head.parentElement!;
const body: HTMLBodyElement = root.querySelector(':scope > body')!;

let appCreated = false;

export class App extends Component<{ children: ComponentChildren }> {
	render() {
		return this.props.children;
	}

	static create(children: ComponentChildren) {
		if (appCreated) return;
		body.innerHTML = '';
		appCreated = true;
		render(<App>{children}</App>, body);
	}
}
