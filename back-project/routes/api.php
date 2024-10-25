<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MotifController;
use App\Http\Controllers\TransactionController;

Route::apiResource('motif', MotifController::class);
Route::apiResource('transaction', TransactionController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


