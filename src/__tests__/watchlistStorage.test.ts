import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllWatchlists,
  getWatchlistById,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  updateMovieStatus,
  toggleWatchlistPublic,
  reorderWatchlists,
  reorderMoviesInWatchlist,
  getShareLink,
} from '../services/watchlistStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('watchlistStorage', () => {
  it('returns empty array when no watchlists exist', () => {
    expect(getAllWatchlists()).toEqual([]);
  });

  it('creates a watchlist', () => {
    const list = createWatchlist('科幻片单', '我的最爱科幻电影');
    expect(list.id).toBeDefined();
    expect(list.name).toBe('科幻片单');
    expect(list.description).toBe('我的最爱科幻电影');
    expect(list.movies).toEqual([]);
    expect(list.isPublic).toBe(false);
    expect(list.shareCode).toBeDefined();
  });

  it('retrieves watchlist by id', () => {
    const list = createWatchlist('测试', '');
    const found = getWatchlistById(list.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe('测试');
  });

  it('updates a watchlist', () => {
    const list = createWatchlist('原名', '原描述');
    const updated = updateWatchlist(list.id, { name: '新名', description: '新描述' });
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe('新名');
    expect(updated!.description).toBe('新描述');
  });

  it('returns null when updating nonexistent watchlist', () => {
    expect(updateWatchlist('fake', { name: 'x' })).toBeNull();
  });

  it('deletes a watchlist', () => {
    const list = createWatchlist('删除测试', '');
    expect(deleteWatchlist(list.id)).toBe(true);
    expect(getAllWatchlists()).toHaveLength(0);
  });

  it('returns false when deleting nonexistent watchlist', () => {
    expect(deleteWatchlist('fake')).toBe(false);
  });

  it('adds a movie to watchlist', () => {
    const list = createWatchlist('片单', '');
    const updated = addMovieToWatchlist(list.id, {
      movieId: 'm1',
      movieTitle: 'Inception',
      posterPath: '/poster.jpg',
      status: '想看',
    });
    expect(updated!.movies).toHaveLength(1);
    expect(updated!.movies[0].movieTitle).toBe('Inception');
    expect(updated!.movies[0].status).toBe('想看');
  });

  it('does not add duplicate movie', () => {
    const list = createWatchlist('片单', '');
    addMovieToWatchlist(list.id, {
      movieId: 'm1',
      movieTitle: 'Inception',
      posterPath: '',
      status: '想看',
    });
    const updated = addMovieToWatchlist(list.id, {
      movieId: 'm1',
      movieTitle: 'Inception',
      posterPath: '',
      status: '在看',
    });
    expect(updated!.movies).toHaveLength(1);
  });

  it('removes a movie from watchlist', () => {
    const list = createWatchlist('片单', '');
    addMovieToWatchlist(list.id, {
      movieId: 'm1',
      movieTitle: 'A',
      posterPath: '',
      status: '想看',
    });
    const updated = removeMovieFromWatchlist(list.id, 'm1');
    expect(updated!.movies).toHaveLength(0);
  });

  it('updates movie status', () => {
    const list = createWatchlist('片单', '');
    addMovieToWatchlist(list.id, {
      movieId: 'm1',
      movieTitle: 'A',
      posterPath: '',
      status: '想看',
    });
    const updated = updateMovieStatus(list.id, 'm1', '已看');
    expect(updated!.movies[0].status).toBe('已看');
  });

  it('toggles watchlist public state', () => {
    const list = createWatchlist('片单', '');
    expect(list.isPublic).toBe(false);
    const toggled = toggleWatchlistPublic(list.id);
    expect(toggled!.isPublic).toBe(true);
    const toggled2 = toggleWatchlistPublic(list.id);
    expect(toggled2!.isPublic).toBe(false);
  });

  it('reorders watchlists', () => {
    const l1 = createWatchlist('A', '');
    const l2 = createWatchlist('B', '');
    const l3 = createWatchlist('C', '');
    reorderWatchlists([l3.id, l1.id, l2.id]);
    const all = getAllWatchlists();
    expect(all[0].id).toBe(l3.id);
    expect(all[1].id).toBe(l1.id);
    expect(all[2].id).toBe(l2.id);
  });

  it('reorders movies in watchlist', () => {
    const list = createWatchlist('片单', '');
    addMovieToWatchlist(list.id, { movieId: 'm1', movieTitle: 'A', posterPath: '', status: '想看' });
    addMovieToWatchlist(list.id, { movieId: 'm2', movieTitle: 'B', posterPath: '', status: '想看' });
    addMovieToWatchlist(list.id, { movieId: 'm3', movieTitle: 'C', posterPath: '', status: '想看' });
    const updated = reorderMoviesInWatchlist(list.id, ['m3', 'm1', 'm2']);
    expect(updated!.movies[0].movieId).toBe('m3');
    expect(updated!.movies[1].movieId).toBe('m1');
    expect(updated!.movies[2].movieId).toBe('m2');
  });

  it('generates a share link', () => {
    const list = createWatchlist('片单', '');
    toggleWatchlistPublic(list.id);
    const updated = getWatchlistById(list.id)!;
    const link = getShareLink(updated);
    expect(link).toContain(updated.shareCode);
  });
});
