
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { getWorkouts } from '@/lib/api';
import type { Workout } from '@/types/workout';
import { WorkoutCard } from './WorkoutCard';

export default function HomeClient() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('duration');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;

    getWorkouts()
      .then((data) => {
        if (alive) {
          setWorkouts(data);
          setError('');
        }
      })
      .catch((e: unknown) => {
        if (alive) {
          setError(
            e instanceof Error
              ? e.message
              : 'Unable to load workouts. Please try again.'
          );
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return workouts
      .filter((workout) => {
        const searchableText = [
          workout.name,
          ...workout.muscleGroups,
          workout.equipment,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sort === 'calories') {
          return b.caloriesBurned - a.caloriesBurned;
        }

        if (sort === 'rating') {
          return b.rating - a.rating;
        }

        return a.duration - b.duration;
      });
  }, [workouts, query, sort]);

  return (
    <>
      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> WORKOUT LIBRARY
          </div>

          <h1>
            TRAIN WITH
            <br />
            <em>INTENT.</em> LOG
            <br />
            EVERY SET<span className="accent-period">.</span>
          </h1>

          <p className="hero-subtitle">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <a className="button button-primary hero-cta" href="#library">
            BROWSE WORKOUTS <ArrowDown size={17} />
          </a>

          <div className="hero-note">
            <span className="tiny-line" /> BUILT FOR CONSISTENCY
          </div>
        </div>

        <div className="hero-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />

          <div className="hero-image-box">
            <Image
              src="/assets/banner.png"
              alt="Athlete performing a bicep curl"
              width={334}
              height={334}
              priority
            />
          </div>

          <div className="art-label label-top">
            <span className="live-dot" /> TRAINING MODE
          </div>

          <div className="art-label label-bottom">
            <b>01 / 12</b>
            <span>THE LIBRARY</span>
          </div>

          <div className="art-cross">+</div>
        </div>
      </section>

      <section className="library section-shell" id="library">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> FIND YOUR NEXT SET
            </div>

            <h2>
              THE <span>LIBRARY</span>
            </h2>

            <p>Twelve lifts covering every major muscle group.</p>
          </div>

          <div className="library-tools">
            <label className="search-box">
              <Search size={17} />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search workouts or muscle"
                aria-label="Search workouts by name, equipment, or muscle group"
              />
            </label>

            <label className="sort-select">
              <SlidersHorizontal size={15} />
              <span>Sort By</span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort workouts"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="loading-grid" aria-label="Loading workouts">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="skeleton-card" key={index}>
                <div />
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="state-panel" role="alert">
            <div className="state-icon">!</div>
            <h3>COULDN&apos;T LOAD WORKOUTS</h3>
            <p>{error}</p>

            <button
              className="button button-outline"
              onClick={() => window.location.reload()}
            >
              Try again <ArrowRight size={16} />
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-panel" aria-live="polite">
            <h3>NO WORKOUTS FOUND</h3>
            <p>Try another workout name or muscle group.</p>

            <button
              className="button button-outline"
              onClick={() => setQuery('')}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="workout-grid" aria-live="polite">
            {filtered.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}

        <div className="library-bottom">
          <span>
            SHOWING <b>{filtered.length.toString().padStart(2, '0')}</b>{' '}
            MOVEMENTS
          </span>

          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            BACK TO TOP ↑
          </a>
        </div>
      </section>
    </>
  );
}
