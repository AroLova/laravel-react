<?php

// database/migrations/2024_10_24_000002_create_transactions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id(); // Crée une colonne `id` de type BIGINT
            $table->decimal('amount', 10, 2); // Montant de la transaction
            $table->enum('type', ['entry', 'exit']); // Type de transaction
            $table->text('description'); // Description de la transaction
            $table->dateTime('dateTrans'); // Date de la transaction
            $table->timestamps(); // Colonnes created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
