export function createVariant<TProps extends Record<string, string>>(input: { [key in keyof TProps]?: Record<TProps[key], string> }) {
	const variants = Object.keys(input) as Array<keyof TProps>;
	return (props: Partial<TProps>) => {
		return variants
			.map((variant) => {
				const propValue = props[variant];
				const variantConfig = input[variant];
				if (propValue && variantConfig && propValue in variantConfig) {
					return variantConfig[propValue as TProps[typeof variant]];
				}
				return '';
			})
			.filter(Boolean)
			.join(' ');
	};
}
