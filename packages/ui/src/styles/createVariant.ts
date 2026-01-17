export function createVariant<TProps extends Record<string, string | boolean | undefined>>(input: {
	[key in keyof TProps]?: NonNullable<TProps[key]> extends boolean
		? { true: string; false: string }
		: NonNullable<TProps[key]> extends string | number | symbol
		? Partial<Record<NonNullable<TProps[key]>, string>>
		: never;
}) {
	const variants = Object.keys(input) as Array<keyof TProps>;
	return (props: Partial<TProps>) => {
		return variants
			.map((variant) => {
				const propValue = props[variant];
				const variantConfig = input[variant];
				if (typeof propValue === 'boolean') {
					const boolConfig = variantConfig as { true: string; false: string } | undefined;
					if (boolConfig) {
						return propValue ? boolConfig['true'] : boolConfig['false'];
					}
					return '';
				}

				if (propValue && variantConfig) {
					const stringConfig = variantConfig as Record<string, string>;
					if ((propValue as string) in stringConfig) {
						return stringConfig[propValue as string];
					}
				}
				return '';
			})
			.filter(Boolean)
			.join(' ');
	};
}
