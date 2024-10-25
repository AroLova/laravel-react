<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motif extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'transaction_id',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
