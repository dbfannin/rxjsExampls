import {isEqual} from 'lodash';
import {combineLatest, concat, forkJoin, of, TimeoutError} from 'rxjs';
import {
  catchError,
  concatMap, concatMapTo, debounce, debounceTime,
  delay,
  distinctUntilChanged,
  distinctUntilKeyChanged, filter,
  pairwise, startWith, switchMap,
  switchMapTo,
  take, takeUntil,
  tap, throttle, throttleTime, timeout
} from 'rxjs/operators';
import {TestScheduler} from 'rxjs/testing';


/* Marble testing documentation https://medium.com/@bencabanes/marble-testing-observable-introduction-1f5ad39231c */


describe('RxjsExamples', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  // describe('forkJoin', () => {
  //   it('should forkJoin', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source1$ = cold('a 10s b |', {
  //         a: 1,
  //         b: 2
  //       });
  //
  //       const source2$ = cold('10ms a 10ms b|', {
  //         a: 11,
  //         b: 22
  //       });
  //       const combinedSource$ = forkJoin(source1$, source2$);
  //
  //       expectObservable(combinedSource$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('combineLatest', () => {
  //   it('should combineLatest', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source1$ = cold('a 10s b', {
  //         a: 1,
  //         b: 2
  //       });
  //
  //       const source2$ = cold('10ms a 10ms b', {
  //         a: 11,
  //         b: 22
  //       });
  //       const combinedSource$ = combineLatest([source1$, source2$]);
  //
  //       expectObservable(combinedSource$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('concat', () => {
  //   it('should concat', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source1$ = cold('a 10s  b|', {
  //         a: 1,
  //         b: 2,
  //       });
  //
  //       const source2$ = cold('100ms a 50ms b', {
  //         a: 11,
  //         b: 22,
  //       });
  //
  //       const merged$ = concat(source1$, source2$);
  //       expectObservable(merged$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('take', () => {
  //   it('should take 1', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: 1,
  //         b: 2,
  //         c: 3,
  //         d: 4
  //       }).pipe(
  //         take(1)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('takeUntil', () => {
  //   it('should takeUntil', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: 1,
  //         b: 2,
  //         c: 3,
  //         d: 4
  //       }).pipe(
  //         takeUntil(cold('10ms a'))
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('pairwise', () => {
  //   it('should pairwise', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: 1,
  //         b: 2,
  //         c: 3,
  //         d: 4
  //       }).pipe(
  //         pairwise()
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('startWith', () => {
  //   it('should startWith', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 10ms b - c 10ms d', {
  //         a: 1,
  //         b: 2,
  //         c: 3,
  //         d: 4
  //       }).pipe(
  //         startWith(100)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('catchError', () => {
  //   it('should catchError', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a', {
  //         a: 'success'
  //       }).pipe(
  //         tap((value) => {
  //           throw new Error('blah');
  //         }),
  //         catchError(() => of('error'))
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('filter', () => {
  //   it('should filter', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a - b - c - d', {
  //         a: true,
  //         b: false,
  //         c: true,
  //         d: false
  //       }).pipe(
  //         filter((value) => value)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('debounce', () => {
  //   it('should debounce', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
  //         a: 'a',
  //         b: 'ab',
  //         c: 'abc',
  //         d: 'abcd',
  //         e: 'abcde',
  //         f: 'abcdef',
  //         g: 'abcdefg',
  //       }).pipe(
  //         debounce(() => of(null).pipe(delay(400)))
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('debounceTime', () => {
  //   it('should debounceTime', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
  //         a: 'a',
  //         b: 'ab',
  //         c: 'abc',
  //         d: 'abcd',
  //         e: 'abcde',
  //         f: 'abcdef',
  //         g: 'abcdefg',
  //       }).pipe(
  //         debounceTime(400)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('throttle', () => {
  //   it('should throttle', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
  //         a: 'a',
  //         b: 'ab',
  //         c: 'abc',
  //         d: 'abcd',
  //         e: 'abcde',
  //         f: 'abcdef',
  //         g: 'abcdefg',
  //       }).pipe(
  //         throttle(() => of(null).pipe(delay(400)))
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('throttleTime', () => {
  //   it('should throttleTime', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
  //         a: 'a',
  //         b: 'ab',
  //         c: 'abc',
  //         d: 'abcd',
  //         e: 'abcde',
  //         f: 'abcdef',
  //         g: 'abcdefg',
  //       }).pipe(
  //         throttleTime(400)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('distinctUntilChanged', () => {
  //   it('should only fire when the primitive value changes', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: true,
  //         b: false,
  //         c: false,
  //         d: true
  //       }).pipe(
  //         distinctUntilChanged()
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  //
  //   it('should only fire when the object changes using deep equals', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: {id: 1234},
  //         b: {id: 1234},
  //         c: {id: 1234},
  //         d: {id: 12344}
  //       }).pipe(
  //         distinctUntilChanged(isEqual)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('distinctUntilKeyChanged', () => {
  //   it('should only fire if the key changes', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: {id: 1234},
  //         b: {id: 12345},
  //         c: {id: 12345},
  //         d: {id: 123456}
  //       }).pipe(
  //         distinctUntilKeyChanged('id')
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('delay', () => {
  //   it('should delay', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a ---- b ---- c 50ms d', {
  //         a: 1,
  //         b: 2,
  //         c: 3,
  //         d: 4
  //       }).pipe(
  //         delay(500)
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('timeout', () => {
  //   it('should timeout', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 1s b', {
  //         a: 1,
  //         b: 2
  //       }).pipe(
  //         timeout(500)
  //       );
  //
  //       expectObservable(source$).toBe('', {}, new TimeoutError());
  //     });
  //   });
  // });
  //
  // describe('switchMap', () => {
  //   it('should switchMap', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a', {
  //         a: 'success'
  //       }).pipe(
  //         switchMap(() => of(1).pipe(delay(100))),
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('switchMapTo', () => {
  //   it('should switchMapTo', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a', {
  //         a: 'success'
  //       }).pipe(
  //         switchMapTo(of(1)),
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('concatMap', () => {
  //   it('should concatMap', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 10s b', {
  //         a: 100,
  //         b: 200
  //       }).pipe(
  //         concatMap((value) => of(`hello ${value}`).pipe(delay(value))),
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
  //
  // describe('concatMapTo', () => {
  //   it('should concatMapTo', () => {
  //     testScheduler.run(({expectObservable, cold}) => {
  //       const source$ = cold('a 10s b', {
  //         a: 100,
  //         b: 200
  //       }).pipe(
  //         concatMapTo(of(100).pipe(delay(500))),
  //       );
  //
  //       expectObservable(source$).toBe('', {});
  //     });
  //   });
  // });
});


/**
 * Things to know:
 * Subjects / BehaviorSubjects, ReplaySubjects
 *
 *
 * forkJoin, combineLatest, merge, concat, from, fromEvent, of
 *
 * map, tap, take, takeUntil, pairwise, startWith, catchError, filter, debounce/debounceTime, throttle/throttleTime, distinctUntilChanged,
 * distinctUntilKeyChanged, delay, finalize, timeout, shareReplay
 *
 * switchMap/switchMapTo, concatMap/concatMapTo
 *
 *
 * Why Multicast?
 * What's the danger of using async pipe when unicasting
 * Cold vs Hot observable
 * what is a connectable observable
 */
