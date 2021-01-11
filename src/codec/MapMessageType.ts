/*
 * Copyright (c) 2008-2021, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* tslint:disable */
export class MapMessageType {
    static MAP_PUT = 0x0101;
    static MAP_GET = 0x0102;
    static MAP_REMOVE = 0x0103;
    static MAP_REPLACE = 0x0104;
    static MAP_REPLACEIFSAME = 0x0105;
    static MAP_CONTAINSKEY = 0x0109;
    static MAP_CONTAINSVALUE = 0x010a;
    static MAP_REMOVEIFSAME = 0x010b;
    static MAP_DELETE = 0x010c;
    static MAP_FLUSH = 0x010d;
    static MAP_TRYREMOVE = 0x010e;
    static MAP_TRYPUT = 0x010f;
    static MAP_PUTTRANSIENT = 0x0110;
    static MAP_PUTIFABSENT = 0x0111;
    static MAP_SET = 0x0112;
    static MAP_LOCK = 0x0113;
    static MAP_TRYLOCK = 0x0114;
    static MAP_ISLOCKED = 0x0115;
    static MAP_UNLOCK = 0x0116;
    static MAP_ADDINTERCEPTOR = 0x0117;
    static MAP_REMOVEINTERCEPTOR = 0x0118;
    static MAP_ADDENTRYLISTENERTOKEYWITHPREDICATE = 0x0119;
    static MAP_ADDENTRYLISTENERWITHPREDICATE = 0x011a;
    static MAP_ADDENTRYLISTENERTOKEY = 0x011b;
    static MAP_ADDENTRYLISTENER = 0x011c;
    static MAP_ADDNEARCACHEENTRYLISTENER = 0x011d;
    static MAP_REMOVEENTRYLISTENER = 0x011e;
    static MAP_ADDPARTITIONLOSTLISTENER = 0x011f;
    static MAP_REMOVEPARTITIONLOSTLISTENER = 0x0120;
    static MAP_GETENTRYVIEW = 0x0121;
    static MAP_EVICT = 0x0122;
    static MAP_EVICTALL = 0x0123;
    static MAP_LOADALL = 0x0124;
    static MAP_LOADGIVENKEYS = 0x0125;
    static MAP_KEYSET = 0x0126;
    static MAP_GETALL = 0x0127;
    static MAP_VALUES = 0x0128;
    static MAP_ENTRYSET = 0x0129;
    static MAP_KEYSETWITHPREDICATE = 0x012a;
    static MAP_VALUESWITHPREDICATE = 0x012b;
    static MAP_ENTRIESWITHPREDICATE = 0x012c;
    static MAP_ADDINDEX = 0x012d;
    static MAP_SIZE = 0x012e;
    static MAP_ISEMPTY = 0x012f;
    static MAP_PUTALL = 0x0130;
    static MAP_CLEAR = 0x0131;
    static MAP_EXECUTEONKEY = 0x0132;
    static MAP_SUBMITTOKEY = 0x0133;
    static MAP_EXECUTEONALLKEYS = 0x0134;
    static MAP_EXECUTEWITHPREDICATE = 0x0135;
    static MAP_EXECUTEONKEYS = 0x0136;
    static MAP_FORCEUNLOCK = 0x0137;
    static MAP_KEYSETWITHPAGINGPREDICATE = 0x0138;
    static MAP_VALUESWITHPAGINGPREDICATE = 0x0139;
    static MAP_ENTRIESWITHPAGINGPREDICATE = 0x013a;
    static MAP_CLEARNEARCACHE = 0x013b;
    static MAP_FETCHKEYS = 0x013c;
    static MAP_FETCHENTRIES = 0x013d;
    static MAP_AGGREGATE = 0x013e;
    static MAP_AGGREGATEWITHPREDICATE = 0x013f;
    static MAP_PROJECT = 0x0140;
    static MAP_PROJECTWITHPREDICATE = 0x0141;
    static MAP_FETCHNEARCACHEINVALIDATIONMETADATA = 0x0142;
    static MAP_ASSIGNANDGETUUIDS = 0x0143;
    static MAP_REMOVEALL = 0x0144;
    static MAP_ADDNEARCACHEINVALIDATIONLISTENER = 0x0145;
    static MAP_FETCHWITHQUERY = 0x0146;
    static MAP_EVENTJOURNALSUBSCRIBE = 0x0147;
    static MAP_EVENTJOURNALREAD = 0x0148;
}
