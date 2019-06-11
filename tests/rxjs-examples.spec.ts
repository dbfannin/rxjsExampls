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



describe('RxjsExamples', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('forkJoin', () => {
    it('should forkJoin', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source1$ = cold('a 10s b |', {
          a: 1,
          b: 2
        });

        const source2$ = cold('10ms a 10ms b|', {
          a: 11,
          b: 22
        });
        const combinedSource$ = forkJoin(source1$, source2$);

        expectObservable(combinedSource$).toBe('10s -- (a|)', {
          a: [2, 22]
        });
      });
    });
  });

  describe('combineLatest', () => {
    it('should combineLatest', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source1$ = cold('a 10s b', {
          a: 1,
          b: 2
        });

        const source2$ = cold('10ms a 10ms b', {
          a: 11,
          b: 22
        });
        const combinedSource$ = combineLatest([source1$, source2$]);

        expectObservable(combinedSource$).toBe('10ms a 10ms b 9s 979ms c', {
          a: [1, 11],
          b: [1, 22],
          c: [2, 22]
        });
      });
    });
  });

  describe('concat', () => {
    it('should concat', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source1$ = cold('a 10s  b|', {
          a: 1,
          b: 2,
        });

        const source2$ = cold('100ms a 50ms b', {
          a: 11,
          b: 22,
        });

        const merged$ = concat(source1$, source2$);
        expectObservable(merged$).toBe('a 10s b 100ms c 50ms d', {
          a: 1,
          b: 2,
          c: 11,
          d: 22,
        });
      });
    });
  });

  describe('take', () => {
    it('should take 1', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        }).pipe(
            take(1)
        );

        expectObservable(source$).toBe('(a|)', {
          a: 1
        });
      });
    });
  });

  describe('takeUntil', () => {
    it('should takeUntil', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        }).pipe(
            takeUntil(cold('10ms a'))
        );

        expectObservable(source$).toBe('a ---- b ---- |', {
          a: 1,
          b: 2
        });
      });
    });
  });

  describe('pairwise', () => {
    it('should pairwise', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        }).pipe(
            pairwise()
        );

        expectObservable(source$).toBe('----- a ---- b 50ms c', {
          a: [1, 2],
          b: [2, 3],
          c: [3, 4]
        });
      });
    });
  });

  describe('startWith', () => {
    it('should startWith', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 10ms b - c 10ms d', {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        }).pipe(
            startWith(100)
        );

        expectObservable(source$).toBe('(ab) 7ms c - d 10ms e', {
          a: 100,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
        });
      });
    });
  });

  describe('catchError', () => {
    it('should catchError', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a', {
          a: 'success'
        }).pipe(
            tap((value) => {
              throw new Error('blah');
            }),
            catchError(() => of('error'))
        );

        expectObservable(source$).toBe('(a|)', {
          a: 'error'
        });
      });
    });
  });

  describe('filter', () => {
    it('should filter', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a - b - c - d', {
          a: true,
          b: false,
          c: true,
          d: false
        }).pipe(
            filter((value) => value)
        );

        expectObservable(source$).toBe('a --- b', {
          a: true,
          b: true
        });
      });
    });
  });

  describe('debounce', () => {
    it('should debounce', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
          a: 'a',
          b: 'ab',
          c: 'abc',
          d: 'abcd',
          e: 'abcde',
          f: 'abcdef',
          g: 'abcdefg',
        }).pipe(
            debounce(() => of(null).pipe(delay(400)))
        );

        expectObservable(source$).toBe('- 300ms - 300ms - 300ms --- 400ms a 1s -- b', {
          a: 'abcde',
          b: 'abcdefg'
        });
      });
    });
  });

  describe('debounceTime', () => {
    it('should debounceTime', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
          a: 'a',
          b: 'ab',
          c: 'abc',
          d: 'abcd',
          e: 'abcde',
          f: 'abcdef',
          g: 'abcdefg',
        }).pipe(
            debounceTime(400)
        );

        expectObservable(source$).toBe('- 300ms - 300ms - 300ms --- 400ms a 1s -- b', {
          a: 'abcde',
          b: 'abcdefg'
        });
      });
    });
  });

  describe('throttle', () => {
    it('should throttle', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
          a: 'a',
          b: 'ab',
          c: 'abc',
          d: 'abcd',
          e: 'abcde',
          f: 'abcdef',
          g: 'abcdefg',
        }).pipe(
            throttle(() => of(null).pipe(delay(400)))
        );

        expectObservable(source$).toBe('a 600ms - b 1s 304ms c', {
          a: 'a',
          b: 'abc',
          c: 'abcdef'
        });
      });
    });
  });

  describe('throttleTime', () => {
    it('should throttleTime', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 300ms b 300ms c 300ms d  -- e 1s f - g', {
          a: 'a',
          b: 'ab',
          c: 'abc',
          d: 'abcd',
          e: 'abcde',
          f: 'abcdef',
          g: 'abcdefg',
        }).pipe(
            throttleTime(400)
        );

        expectObservable(source$).toBe('a 600ms - b 1s 304ms c', {
          a: 'a',
          b: 'abc',
          c: 'abcdef'
        });
      });
    });
  });

  describe('distinctUntilChanged', () => {
    it('should only fire when the primitive value changes', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: true,
          b: false,
          c: false,
          d: true
        }).pipe(
            distinctUntilChanged()
        );

        expectObservable(source$).toBe('a ---- b ---- - 50ms c', {
          a: true,
          b: false,
          c: true
        });
      });
    });

    it('should only fire when the object changes using deep equals', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: {id: 1234},
          b: {id: 1234},
          c: {id: 1234},
          d: {id: 12344}
        }).pipe(
            distinctUntilChanged(isEqual)
        );

        expectObservable(source$).toBe('a ---- - ---- - 50ms b', {
          a: {id: 1234},
          b: {id: 12344}
        });
      });
    });
  });

  describe('distinctUntilKeyChanged', () => {
    it('should only fire if the key changes', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: {id: 1234},
          b: {id: 12345},
          c: {id: 12345},
          d: {id: 123456}
        }).pipe(
            distinctUntilKeyChanged('id')
        );

        expectObservable(source$).toBe('a ---- b ---- - 50ms c', {
          a: {id: 1234},
          b: {id: 12345},
          c: {id: 123456}
        });
      });
    });
  });

  describe('delay', () => {
    it('should delay', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a ---- b ---- c 50ms d', {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        }).pipe(
            delay(500)
        );

        expectObservable(source$).toBe('500ms a ---- b ---- c 50ms d', {
          a: 1,
          b: 2,
          c: 3,
          d: 4
        });
      });
    });
  });

  describe('timeout', () => {
    it('should timeout', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 1s b', {
          a: 1,
          b: 2
        }).pipe(
            timeout(500)
        );

        expectObservable(source$).toBe('a 499ms #', {
          a: 1,
          b: 2,
          c: 3
        }, new TimeoutError());
      });
    });
  });

  describe('switchMap', () => {
    it('should switchMap', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a', {
          a: 'success'
        }).pipe(
            switchMap(() => of(1).pipe(delay(100))),
        );

        expectObservable(source$).toBe('100ms a', {
          a: 1
        });
      });
    });
  });

  describe('switchMapTo', () => {
    it('should switchMapTo', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a', {
          a: 'success'
        }).pipe(
            switchMapTo(of(1)),
        );

        expectObservable(source$).toBe('a', {
          a: 1
        });
      });
    });
  });

  describe('concatMap', () => {
    it('should concatMap', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 10s b', {
          a: 100,
          b: 200
        }).pipe(
            concatMap((value) => of(`hello ${value}`).pipe(delay(value))),
        );

        expectObservable(source$).toBe('100ms a 10s 100ms b', {
          a: 'hello 100',
          b: 'hello 200'
        });
      });
    });
  });

  describe('concatMapTo', () => {
    it('should concatMapTo', () => {
      testScheduler.run(({expectObservable, cold}) => {
        const source$ = cold('a 10s b', {
          a: 100,
          b: 200
        }).pipe(
            concatMapTo(of(100).pipe(delay(500))),
        );

        expectObservable(source$).toBe('500ms a 10s b', {
          a: 100,
          b: 100
        });
      });
    });
  });
});
