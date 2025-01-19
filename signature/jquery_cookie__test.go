package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryCookieSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body: `
/*jshint eqnull:true */
/*!
 * jQuery Cookie Plugin v1.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($, document) {`,
		},
		detected: true,
		version:  "1.1",
	}} // TODO: Add a test for script tag with src attribute

	runTests(t, cases, &JQueryCookieSignature)
}
