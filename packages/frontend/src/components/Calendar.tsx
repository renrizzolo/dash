// TODO - solid doesn't accept htmlFor
// oxlint-disable label-has-associated-control
import { createSignal, createEffect, For, Show } from 'solid-js';
import { addRecipe, uploadImage } from '../api';
import { compressImage } from '../utils';
import './Calendar.css';
import type { Recipe } from '../types';
import { LoadingBlip } from 'ui/components';

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

	return (
		<>
			<div class="card">
				{props.isError && (
					<div class="error">
						Error loading recipes <br />
						<button
							type="button"
							class="button"
							onClick={() => {
								props.refetch();
							}}
						>
							Retry
						</button>
					</div>
				)}
				<div class="calendar-header calendar-grid">
					<button type="button" class="button button-icon" onClick={() => changeMonth(-1)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
							/>
						</svg>
					</button>
					<span class="calendar-header-title">
						{props.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
						{selectedDateString() !== todayDateString() && (
							<button type="button" class="button button-icon" onClick={goToToday}>
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
							</button>
						)}
					</span>
					<button type="button" class="button button-icon" onClick={() => changeMonth(1)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</button>
				</div>
				<div class={`calendar-grid ${props.isLoading ? 'loading' : ''}`}>
					<div class="day-name">Sun</div>
					<div class="day-name">Mon</div>
					<div class="day-name">Tue</div>
					<div class="day-name">Wed</div>
					<div class="day-name">Thu</div>
					<div class="day-name">Fri</div>
					<div class="day-name">Sat</div>
					<For each={days()}>
						{(day) => (
							<button
								type="button"
								tabindex={!day ? -1 : undefined}
								class={`calendar-day ${day && selectedDateString() && toLocalDateString(day) === selectedDateString() ? 'selected ' : ''}${
									day && toLocalDateString(day) === todayDateString() ? 'today ' : ''
								}${day ? '' : 'empty'}`}
								onClick={() => handleDateClick(day)}
							>
								{day ? day.getDate() : ''}
								{day && getRecipesForDate(day).length > 0 && <div class="dot"></div>}
							</button>
						)}
					</For>

					<button
						type="button"
						class="button button-icon button-add-recipe"
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
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
							</svg>
						</Show>
					</button>
				</div>

				<div class="absolute bottom-2 right-2">
					<LoadingBlip active={props.isFetching} />
				</div>
			</div>

			<Show when={showForm()}>
				<form
					onSubmit={(e) => {
						void handleAdd(e);
					}}
					class="add-recipe-form"
				>
					<h3>Add New Recipe for {selectedDate()?.toLocaleDateString('en-GB')}</h3>
					<div class="form-field">
						<label for="recipe-name">Recipe name</label>
						<input
							id="recipe-name"
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
					</div>
					<div class="form-field">
						<label for="description">Description</label>
						<textarea
							id="description"
							placeholder="Description"
							value={newRecipeDesc()}
							onInput={(e) => setNewRecipeDesc(e.currentTarget.value)}
						/>
					</div>
					<div class="form-field">
						<label for="tags">Tags (comma separated)</label>
						<input
							id="tags"
							type="text"
							placeholder="Tags (comma separated)"
							aria-label="Tags"
							value={newRecipeTags()}
							onInput={(e) => setNewRecipeTags(e.currentTarget.value)}
						/>
					</div>
					<div class="form-field">
						<label for="url">Recipe URL</label>

						<input
							type="url"
							placeholder="URL"
							aria-label="Recipe URL"
							value={newRecipeUrl() || ''}
							onInput={(e) => setNewRecipeUrl(e.currentTarget.value)}
						/>
					</div>
					<div class="form-field">
						<label for="image">Recipe Image</label>
						<input
							id="image"
							type="file"
							accept="image/*"
							onChange={(e) => setNewRecipeImage(e.currentTarget.files ? e.currentTarget.files[0] : null)}
						/>
					</div>

					<button type="submit" class="button">
						Save
					</button>
				</form>
			</Show>
			<div class="recipe-details">
				<Show when={selectedDate()}>
					<div class="recipes-list">
						<For each={getRecipesForDate(selectedDate()!)}>
							{(recipe) => (
								<div class="card recipe-card">
									<div class="recipe-card-content">
										<h4>{recipe.name}</h4>
										<p>{recipe.description}</p>
										{recipe.url && (
											<p>
												<a href={recipe.url} target="_blank" rel="noopener noreferrer">
													View Recipe
												</a>
											</p>
										)}
										<div class="tags">
											<For each={recipe.tags}>{(tag) => <span class="tag">{tag}</span>}</For>
										</div>
									</div>
									{recipe.image && <img src={`/api/recipes/images/${recipe.image}`} alt={recipe.name} class="recipe-image" />}
								</div>
							)}
						</For>
					</div>
				</Show>
			</div>
		</>
	);
}
