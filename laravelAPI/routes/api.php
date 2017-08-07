<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::resource('users','UserController',['only' => [
    'index', 'store', 'show', 'update', 'destroy'
]]);

Route::get('users/{id}/name', 'UserController@myName');
Route::get('users/{id}/tasks', 'UserController@tasksOwner');

Route::resource('tasks','TaskController',['only' => [
    'index', 'store', 'show', 'update', 'destroy'
]]);

Route::post('tasks/{id}/close', 'TaskController@close');
Route::post('tasks/{id}/open', 'TaskController@open');