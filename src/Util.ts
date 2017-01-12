import Long = require('long');
import {PagingPredicate} from './serialization/DefaultPredicates';
import {IterationType} from './core/Predicate';
import * as assert from 'assert';
export function assertNotNull(v: any) {
    assert.notEqual(v, null, 'Non null value expected.');
}

export function assertArray(x: any) {
    assert(Array.isArray(x), 'Should be array.');
}

export function shuffleArray<T>(array: Array<T>): void {
    var randomIndex: number;
    var temp: T;
    for (var i = array.length; i > 1; i--) {
        randomIndex = Math.floor(Math.random() * i);
        temp = array[i - 1];
        array[i - 1] = array[randomIndex];
        array[randomIndex] = temp;
    }
}

export function getType(obj: any): string {
    assertNotNull(obj);
    if (Long.isLong(obj)) {
        return 'long';
    } else {
        var t = typeof obj;
        if (t !== 'object') {
            return t;
        } else {
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        }
    }
}

export function enumFromString<T>(enumType: any, value: string): T {
    return enumType[value];
}

export function getSortedQueryResultSet(list: Array<any>, predicate: PagingPredicate) {
    if (list.length === 0) {
        return list;
    }
    var comparatorObject = predicate.getComparator();
    if (comparatorObject != null) {
        list.sort(comparatorObject.sort.bind(comparatorObject));
    }
    var nearestAnchorEntry = (predicate == null) ? null : predicate.getNearestAnchorEntry();
    var nearestPage = nearestAnchorEntry[0];
    var page = predicate.getPage();
    var pageSize = predicate.getPageSize();
    var begin = pageSize * (page - nearestPage - 1);
    var size = list.length;
    if (begin > size ) {
        return [];
    }
    var end = begin + pageSize;
    if (end > size) {
        end = size;
    }

    setAnchor(list, predicate, nearestPage);
    var iterationType = predicate.getIterationType();
    return list.slice(begin, end).map(function(item) {
        switch (iterationType) {
            case IterationType.ENTRY: return item;
            case IterationType.KEY: return item[0];
            case IterationType.VALUE: return item[1];
        }
    });
}

function setAnchor(list: Array<any>, predicate: PagingPredicate, nearestPage: number) {
    assert(list.length > 0);
    var size = list.length;
    var pageSize = predicate.getPageSize();
    var page = predicate.getPage();
    for (var i = pageSize; i <= size && nearestPage < page; i += pageSize ) {
        var anchor = list[i - 1];
        nearestPage++;
        predicate.setAnchor(nearestPage, anchor);
    }
}
