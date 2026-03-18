// TODO - solid doesn't accept htmlFor
// oxlint-disable label-has-associated-control
import { createSignal, createEffect, For, Show } from 'solid-js';
import { clsx } from 'clsx';
import { addRecipe, uploadImage } from '../api';
import { compressImage } from '../utils';
import type { Recipe } from '../types';
import { LoadingBlip, Card, Button, Input, TextArea, Badge, FileInput, useToast } from 'ui/components';

interface CalendarProps {
	recipes: Recipe[] | undefined;
	refetch: () => void;
	currentDate: Date;
	onMonthChange: (date: Date) => void;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
}

function toLocalDateString(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function Calendar(props: CalendarProps) {
	const [selectedDate, setSelectedDate] = createSignal<Date | null>(props.currentDate);
	const [showForm, setShowForm] = createSignal(false);
	const [newRecipeName, setNewRecipeName] = createSignal('');
	const [newRecipeDesc, setNewRecipeDesc] = createSignal('');
	const [newRecipeUrl, setNewRecipeUrl] = createSignal<string | null>(null);
	const [newRecipeTags, setNewRecipeTags] = createSignal('');
	const [newRecipeImage, setNewRecipeImage] = createSignal<File | null>(null);

	createEffect(() => {
		const viewDate = props.currentDate;
		const today = new Date();
		const isCurrentMonth = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

		if (isCurrentMonth) {
			setSelectedDate(today);
		} else {
			setSelectedDate(viewDate);
		}
	});

	const todayDateString = () => toLocalDateString(new Date());
	const selectedDateString = () => (selectedDate() ? toLocalDateString(selectedDate()!) : null);
	const daysInMonth = () => {
		const year = props.currentDate.getFullYear();
		const month = props.currentDate.getMonth();
		return new Date(year, month + 1, 0).getDate();
	};

	const firstDayOfMonth = () => {
		const year = props.currentDate.getFullYear();
		const month = props.currentDate.getMonth();
		return new Date(year, month, 1).getDay();
	};

	const days = () => {
		const daysArray = [];
		for (let i = 0; i < firstDayOfMonth(); i++) {
			daysArray.push(null);
		}
		for (let i = 1; i <= daysInMonth(); i++) {
			daysArray.push(new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), i));
		}
		return daysArray;
	};

	const getRecipesForDate = (date: Date) => {
		const dateString = toLocalDateString(date);
		return (props.recipes || []).filter((r) => r.date === dateString);
	};

	const goToToday = () => {
		const today = new Date();
		props.onMonthChange(today);
		setSelectedDate(today);
	};

	const handleDateClick = (date: Date | null) => {
		if (date) {
			setSelectedDate(date);
		}
	};

	const handleAdd = async (e: Event) => {
		e.preventDefault();
		if (!selectedDate()) return;

		let imageKey: string | undefined;
		if (newRecipeImage()) {
			const compressedImage = await compressImage(newRecipeImage()!);
			imageKey = await uploadImage(compressedImage);
		}

		const recipe: Parameters<typeof addRecipe>[0] = {
			name: newRecipeName(),
			description: newRecipeDesc(),
			url: newRecipeUrl() || null,
			tags: newRecipeTags()
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean),
			date: toLocalDateString(selectedDate()!),
			image: imageKey,
		};

		await addRecipe(recipe);
		props.refetch();

		setShowForm(false);
		setNewRecipeName('');
		setNewRecipeDesc('');
		setNewRecipeUrl(null);
		setNewRecipeTags('');
		setNewRecipeImage(null);
	};

	const changeMonth = (offset: number) => {
		const newDate = new Date(props.currentDate);
		newDate.setMonth(newDate.getMonth() + offset);
		props.onMonthChange(newDate);
	};

	const toast = useToast();

	createEffect(() => {
		if (props.isError) {
			toast.addToast({
				title: 'Error',
				message: 'Unabled to load recipes',
				action: (
					<Button
						type="button"
						variant="outline"
						size="small"
						onClick={() => {
							props.refetch();
						}}
					>
						Retry
					</Button>
				),
				variant: 'error',
			});
		}
	});

	return (
		<>
			<button
				onClick={() => {
					toast.addToast({
						title: 'Test',
						message:
							Math.random() < 0.5
								? 'Unabled to load recipes'
								: 'Another message that is a bit longer.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.',
						variant: 'default',
					});
				}}
			>
				Test Toast
			</button>
			<Card class="max-w-container mx-auto relative flex-col items-center gap-5">
				<div class="grid grid-cols-7 gap-2 w-full font-mono text-lg font-bold items-center justify-center gap-3 mb-3">
					<Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
							/>
						</svg>
					</Button>
					<span class="items-center flex-row gap-3 justify-center col-span-5">
						{props.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
						{selectedDateString() !== todayDateString() && (
							<Button variant="outline" size="icon" onClick={goToToday}>
								<svg
									width={16}
									height={16}
									data-slot="icon"
									fill="none"
									stroke-width="1.5"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
									></path>
								</svg>
							</Button>
						)}
					</span>
					<Button variant="ghost" size="icon" class="justify-self-end" onClick={() => changeMonth(1)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</Button>
				</div>
				<div
					class={clsx(
						'grid grid-cols-7 gap-2 w-full relative font-mono',
						props.isLoading && 'pointer-events-none animate-skeleton rounded-lg',
					)}
				>
					<div class="text-center font-bold p-1">Sun</div>
					<div class="text-center font-bold p-1">Mon</div>
					<div class="text-center font-bold p-1">Tue</div>
					<div class="text-center font-bold p-1">Wed</div>
					<div class="text-center font-bold p-1">Thu</div>
					<div class="text-center font-bold p-1">Fri</div>
					<div class="text-center font-bold p-1">Sat</div>
					<For each={days()}>
						{(day) => (
							<button
								type="button"
								tabindex={!day ? -1 : undefined}
								data-active={day && selectedDateString() && toLocalDateString(day) === selectedDateString()}
								class={clsx(
									'aspect-square flex-col items-center justify-center rounded-lg cursor-pointer relative transition-all p-0',
									'bg-700 text-inverse hover:bg-900',
									'focus:(ring-inverse bg-500)',
									'active:bg-500 active:hover:bg-600',
									// today
									day && toLocalDateString(day) === todayDateString() ? 'outline-highlight' : '',
									!day && 'invisible pointer-events-none',
								)}
								onClick={() => handleDateClick(day)}
							>
								{day ? day.getDate() : ''}
								{day && getRecipesForDate(day).length > 0 && <div class="w-1.5 h-1.5 bg-accent rounded-full mt-1"></div>}
							</button>
						)}
					</For>

					<Button
						class={clsx(
							'absolute shadow-lg col-start-7 justify-self-center transition-all duration-150',
							showForm() ? '-bottom-74px' : '-bottom-38px',
						)}
						variant="outline"
						rounded="full"
						size="icon"
						aria-pressed={showForm()}
						onClick={() => setShowForm(!showForm())}
					>
						<Show
							when={!showForm()}
							fallback={
								<svg
									data-slot="icon"
									fill="none"
									stroke-width="1.5"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									class="w-6 h-6"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
								</svg>
							}
						>
							<svg
								data-slot="icon"
								fill="none"
								stroke-width="1.5"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
								class="w-6 h-6"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
							</svg>
						</Show>
					</Button>
				</div>

				<div class="absolute top-2 right-2">
					<LoadingBlip active={props.isFetching} />
				</div>
			</Card>

			<Show when={showForm()}>
				<form
					onSubmit={(e) => {
						void handleAdd(e);
					}}
					class="w-full flex-col gap-5 mt-9 animate-fade-in"
				>
					<h3 class="text-lg font-bold">Add New Recipe for {selectedDate()?.toLocaleDateString('en-GB')}</h3>
					<Input
						id="recipe-name"
						label="Recipe Name"
						ref={(el) => {
							setTimeout(() => el?.focus(), 0);
						}}
						type="text"
						placeholder="Recipe Name"
						aria-label="Recipe Name"
						value={newRecipeName()}
						onInput={(e) => setNewRecipeName(e.currentTarget.value)}
						required
					/>
					<TextArea
						id="description"
						label="Description"
						placeholder="Description"
						value={newRecipeDesc()}
						onInput={(e) => setNewRecipeDesc(e.currentTarget.value)}
					/>
					<Input
						id="tags"
						label="Tags (comma separated)"
						type="text"
						placeholder="Tags (comma separated)"
						aria-label="Tags"
						value={newRecipeTags()}
						onInput={(e) => setNewRecipeTags(e.currentTarget.value)}
					/>
					<Input
						id="url"
						label="Recipe URL"
						type="url"
						placeholder="URL"
						aria-label="Recipe URL"
						value={newRecipeUrl() || ''}
						onInput={(e) => setNewRecipeUrl(e.currentTarget.value)}
					/>
					<FileInput
						id="image"
						label="Recipe Image"
						type="file"
						accept="image/*"
						onChange={(e) => setNewRecipeImage(e.currentTarget.files ? e.currentTarget.files[0] : null)}
					/>

					<Button type="submit">Save</Button>
				</form>
			</Show>
			<div class="pt-8">
				<Show when={selectedDate()}>
					<div class="w-full">
						<For each={getRecipesForDate(selectedDate()!)}>
							{(recipe) => (
								<Card class="mb-6 animate-fade-in flex-row gap-2 items-start">
									<div class="flex-col gap-2 flex-1">
										<h4 class="font-bold">{recipe.name}</h4>
										<p>{recipe.description}</p>
										{recipe.url && (
											<p>
												<a href={recipe.url} target="_blank" rel="noopener noreferrer" class="underline hover:text-muted">
													View Recipe
												</a>
											</p>
										)}
										<div class="flex-wrap gap-1.5 mt-auto">
											<For each={recipe.tags}>{(tag) => <Badge>{tag}</Badge>}</For>
										</div>
									</div>
									{recipe.image && (
										<img src={`/api/recipes/images/${recipe.image}`} alt={recipe.name} class="w-full object-cover aspect-square rounded" />
									)}
								</Card>
							)}
						</For>
					</div>
				</Show>
			</div>
		</>
	);
}
