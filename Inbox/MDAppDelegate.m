//
//  MDAppDelegate.m
//  Inbox
//
//  Created by Eric Lee (2015/06/11)
//  Basically, a webview wrapper for Google Inbox so
//  I don't have to have it compete with my chrome windows.
//

#import "MDAppDelegate.h"
#import <WebKit/WebKit.h>


@implementation MDAppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
	NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://inbox.google.com/"]];
    [self.webView setCustomUserAgent: @"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A"];
	[self.webView.mainFrame loadRequest:request];
}

@end
