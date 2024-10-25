<?php
// database/migrations/2024_10_24_000003_create_motifs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMotifsTable extends Migration
{
    public function up()
    {
        Schema::create('motifs', function (Blueprint $table) {
            $table->id(); // Crée une colonne `id` de type BIGINT
            $table->string('name'); // Nom du motif
            $table->text('description')->nullable(); // Description du motif
            $table->unsignedBigInteger('transaction_id')->nullable(); // Clé étrangère vers la table transactions
            $table->timestamps(); // Colonnes created_at et updated_at
        });

        // Ajoutez la contrainte de clé étrangère ici
        Schema::table('motifs', function (Blueprint $table) {
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('motifs', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']); // Supprime la contrainte de clé étrangère
        });
        Schema::dropIfExists('motifs');
    }
}
