<?php

namespace App\Http\Controllers;

use App\Models\Motif;
use Illuminate\Http\Request;

class MotifController extends Controller
{
    public function index()
    {
        $motifs = Motif::with('transaction')->get();
        return response()->json($motifs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'transaction_id' => 'nullable|exists:transactions,id',
        ]);

        $motif = Motif::create($request->all());
        return response()->json($motif, 201);
    }

    public function show($id)
    {
        $motif = Motif::with('transaction')->findOrFail($id);
        return response()->json($motif);
    }

    public function update(Request $request, $id)
    {
        $motif = Motif::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'transaction_id' => 'nullable|exists:transactions,id',
        ]);

        $motif->update($request->all());
        return response()->json($motif);
    }

    public function destroy($id)
    {
        $motif = Motif::findOrFail($id);
        $motif->delete();
        return response()->json(null, 204);
    }
}
