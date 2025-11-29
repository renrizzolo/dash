import { createSignal, For, Show } from 'solid-js';
import { addRecipe, uploadImage } from '../api';
import { compressImage } from '../utils';
import { type Recipe } from '../types';
import './Calendar.css';

interface CalendarProps {
	recipes: Recipe[];
	onRecipeAdded: () => void;
}

export function Calendar(props: CalendarProps) {
	const [currentDate, setCurrentDate] = createSignal(new Date());
	const [selectedDate, setSelectedDate] = createSignal<Date | null>(new Date());
	const [isAdding, setIsAdding] = createSignal(false);
	const [newRecipeName, setNewRecipeName] = createSignal('');
	const [newRecipeDesc, setNewRecipeDesc] = createSignal('');
	const [newRecipeUrl, setNewRecipeUrl] = createSignal<string | null>(null);
	const [newRecipeTags, setNewRecipeTags] = createSignal('');
	const [newRecipeImage, setNewRecipeImage] = createSignal<File | null>(null);

	const toLocalDateString = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const daysInMonth = () => {
		const year = currentDate().getFullYear();
		const month = currentDate().getMonth();
		return new Date(year, month + 1, 0).getDate();
	};

	const firstDayOfMonth = () => {
		const year = currentDate().getFullYear();
		const month = currentDate().getMonth();
		return new Date(year, month, 1).getDay();
	};

	const days = () => {
		const daysArray = [];
		for (let i = 0; i < firstDayOfMonth(); i++) {
			daysArray.push(null);
		}
		for (let i = 1; i <= daysInMonth(); i++) {
			daysArray.push(new Date(currentDate().getFullYear(), currentDate().getMonth(), i));
		}
		return daysArray;
	};

	const getRecipesForDate = (date: Date) => {
		const dateString = toLocalDateString(date);
		return props.recipes.filter((r) => r.date === dateString);
	};

	const goToToday = () => {
		const today = new Date();
		setCurrentDate(today);
		setSelectedDate(today);
	};

	const handleDateClick = (date: Date | null) => {
		if (date) {
			setSelectedDate(date);
			setIsAdding(false);
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
		props.onRecipeAdded();

		setIsAdding(false);
		setNewRecipeName('');
		setNewRecipeDesc('');
		setNewRecipeUrl(null);
		setNewRecipeTags('');
		setNewRecipeImage(null);
	};

	const changeMonth = (offset: number) => {
		const newDate = new Date(currentDate());
		newDate.setMonth(newDate.getMonth() + offset);
		setCurrentDate(newDate);
	};

	return (
		<>
			<div class="card">
				<button type="button" class="button" onClick={goToToday}>
					Today
				</button>
				<div class="calendar-header calendar-grid">
					<button type="button" class="button" onClick={() => changeMonth(-1)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
							/>
						</svg>
					</button>
					<span class="calendar-header-title">{currentDate().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
					<button type="button" class="button" onClick={() => changeMonth(1)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								fill-rule="evenodd"
								d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</button>
				</div>
				<div class="calendar-grid">
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
								class={`calendar-day ${
									day && selectedDate() && toLocalDateString(day) === toLocalDateString(selectedDate()!) ? 'selected' : ''
								} ${day ? '' : 'empty'}`}
								onClick={() => handleDateClick(day)}
							>
								{day ? day.getDate() : ''}
								{day && getRecipesForDate(day).length > 0 && <div class="dot"></div>}
							</button>
						)}
					</For>
				</div>
			</div>
			<div class="card recipe-details">
				<Show when={selectedDate()}>
					<h3>Recipes for {selectedDate()!.toLocaleDateString('en-GB')}</h3>
					<div class="recipes-list">
						<For each={getRecipesForDate(selectedDate()!)}>
							{(recipe) => (
								<div class="recipe-card">
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
						<Show when={getRecipesForDate(selectedDate()!).length === 0}>
							<p>No recipes for this date.</p>
						</Show>
					</div>

					<button type="button" class="button" onClick={() => setIsAdding(!isAdding())}>
						{isAdding() ? 'Cancel' : 'Add Recipe'}
					</button>

					<Show when={isAdding()}>
						<form onSubmit={handleAdd} class="add-recipe-form">
							<input
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
							<textarea placeholder="Description" value={newRecipeDesc()} onInput={(e) => setNewRecipeDesc(e.currentTarget.value)} />
							<input
								type="text"
								placeholder="Tags (comma separated)"
								aria-label="Tags"
								value={newRecipeTags()}
								onInput={(e) => setNewRecipeTags(e.currentTarget.value)}
							/>
							<input
								type="url"
								placeholder="URL"
								aria-label="Recipe URL"
								value={newRecipeUrl() || ''}
								onInput={(e) => setNewRecipeUrl(e.currentTarget.value)}
							/>
							<input
								type="file"
								accept="image/*"
								onChange={(e) => setNewRecipeImage(e.currentTarget.files ? e.currentTarget.files[0] : null)}
							/>
							<button type="submit" class="button">
								Save
							</button>
						</form>
					</Show>
				</Show>
			</div>
		</>
	);
}
